<?php
namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DomCrawler\Crawler;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Helper\ProgressBar;

use Amp\Loop;
use Amp\Promise;
use App\Entity\Apartament;

use function Amp\ParallelFunctions\parallelMap;

class ParserCommand extends Command
{
    protected static $defaultName = 'app:realt.by';
    private $em;

    const ROOMS_URL = [
        "ONE" => [1, "https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZQLb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgATM00xN0gyNLEyTLJNSE5NMDQ3MjYyMTZPNLS1SkixTLQCDVhxN"],
        "TWO" => [2, "https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZILb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgATM00xN0gyNLEyTLJNSE5NMDQ3MjYyMTZPNLS1SkixTLQCDohxO"],
        "THREE" => [3, "https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZYLb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgATM00xN0gyNLEyTLJNSE5NMDQ3MjYyMTZPNLS1SkixTLQCD7hxP"],
        "FOUR" => [4, "https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZELb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgATM00xN0gyNLEyTLJNSE5NMDQ3MjYyMTZPNLS1SkixTLQCEOhxQ"],
        "FIVE" => [5, "https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZULb44taS0AMgvSk2OL0gtii9ITE8FSxkg5DJAAuZppiZphkYWpkmWSamJSaaGBuZGRsamyeaWFilJlqkWAISGHFE%3D"],
        "SIX" => [6, "https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZMLb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgATM00xN0gyNLEyTLJNSE5NMDQ3MjYyMTZPNLS1SkixTLQCE0hxS"],
        "SEVEN" => [7, "https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZcLb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgNWmmZqkGRpZmCZZJqUmJpkaGpgbGRmbJptbWqQkWaZaAACFHhxT"],
        "EIGHT" => [8, "https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZCLb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgATM00xN0gyNLEyTLJNSE5NMDQ3MjYyMTZPNLS1SkixTLQCFahxU"]
    ];

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('Parser is about to run...');

        $progressBar = new ProgressBar($output, count(ParserCommand::ROOMS_URL));
        $progressBar->setFormat('very_verbose');
        $progressBar->start();

        $roomsResult = [];

        foreach(ParserCommand::ROOMS_URL as $rooms_url) {
            [$count, $url] = $rooms_url;
            $roomsResult[] = [$count,  $this->parseSpecificRooms($url, $count)];

            $progressBar->advance();
        };

        $progressBar->finish();

        $output->writeln(PHP_EOL);

        foreach($roomsResult as $roomResult) {
            $output->writeln("imported " . count($roomResult[1]) . " apartament" . (count($roomResult[1]) > 1 ? "s" : "") . " with $roomResult[0] room" . ($roomResult[0] > 1 ? "s" : "") . "!");
        }

        $output->write("Thanks!");

        return Command::SUCCESS;
    }

    private function parseSpecificRooms(string $url, int $count) {
        $crawler = new Crawler(file_get_contents("$url&page=0"));
        $last_link = $crawler->filter('.uni-paging')->first()->filter('a')->last();
        $max_page = 0;

        if ($last_link->count() > 0) {
            $max_page = (int)$last_link->text() - 1;
        }

        $apartamentsList = Promise\wait(parallelMap(range(0, $max_page), function ($page) use ($url, $count) {
            $crawler = new Crawler(file_get_contents("$url&page=$page"));

            $result = $crawler->filter('.bd-item')->each(function($item) use ($count) {
                $price = explode("руб/сутки", $item->filter('.price-byr')->text());

                return [
                    "title" => $item->filter('.title .media-body')->text(),
                    "image" => $item->filter('img')->attr('data-original'),
                    "updated_at" => \DateTime::createFromFormat('d.m.Y', $item->filter('.fa-clock-o')->parents()->text()),
                    "price" => count($price) > 1 ? (int)$price[0] : null,
                    "contact" => $item->filter('[data-full]')->attr('data-full'),
                    "description" => $item->filter('.bd-item-right-center')->text(),
                    "rooms" => $count
                ];
            });

            return $result;
        }));


        $apartamentsList = call_user_func_array('array_merge', $apartamentsList);

        $this->em->beginTransaction();

        try {
            foreach($apartamentsList as $apartamentsItem)
            {
                $apartament = new Apartament();
                $apartament->setTitle($apartamentsItem['title']);
                $apartament->setImage($apartamentsItem['image']);
                $apartament->setUpdatedAt($apartamentsItem['updated_at']);
                $apartament->setPrice($apartamentsItem['price']);
                $apartament->setContact($apartamentsItem['contact']);
                $apartament->setDescription($apartamentsItem['description']);
                $apartament->setRooms($apartamentsItem['rooms']);
                $this->em->persist($apartament);
            }

            $this->em->flush();
            $this->em->commit();

            return $apartamentsList;
        } catch (\Exception $exception) {
            $this->em->rollBack();
            throw $exception;
        }
    }
}