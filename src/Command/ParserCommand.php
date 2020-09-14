<?php
namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\CssSelector\CssSelectorConverter;
use Doctrine\ORM\EntityManagerInterface;

use Amp\Loop;
use Amp\Promise;
use App\Entity\Apartament;

use function Amp\ParallelFunctions\parallelMap;

class ParserCommand extends Command
{
    protected static $defaultName = 'app:realt.by';
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('Parser is about to run...');

        $crawler = new Crawler(file_get_contents("https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZQLb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgAQsUlMMLE0Mk8xSLQxMjdOMkgzMjcxSLFNSzS0MLA2NjACBpBvk&page=0"));
        $max_page = (int)$crawler->filter('.uni-paging')->first()->filter('a')->last()->text() - 1;

        $pages = Promise\wait(parallelMap(range(0, $max_page), function ($page) {
            $crawler = new Crawler(file_get_contents("https://realt.by/rent/flat-for-day/?search=eJwrys%2FPLVY1dUpVNXUBUoZAytZQLb44taS0AMgvSk2OL0gtii9ITAepsDU1QMhlgAQsUlMMLE0Mk8xSLQxMjdOMkgzMjcxSLFNSzS0MLA2NjACBpBvk&page=$page"));

            $result = $crawler->filter('.bd-item')->each(function($item) {
                $price = explode("руб/сутки", $item->filter('.price-byr')->text());

                return [
                    "title" => $item->filter('.title .media-body')->text(),
                    "image" => $item->filter('img')->attr('data-original'),
                    "updated_at" => \DateTime::createFromFormat('d.m.Y', $item->filter('.fa-clock-o')->parents()->text()),
                    "price" => count($price) > 1 ? (int)$price[0] : null,
                    "contact" => $item->filter('[data-full]')->attr('data-full'),
                    "description" => $item->filter('.bd-item-right-center')->text()
                ];
            });

            return $result;
        }));

        Loop::run();

        $pages = call_user_func_array('array_merge', $pages);

        $this->em->beginTransaction();

        try {
            foreach($pages as $page)
            {
                $apartament = new Apartament();
                $apartament->setTitle($page['title']);
                $apartament->setImage($page['image']);
                $apartament->setUpdatedAt($page['updated_at']);
                $apartament->setPrice($page['price']);
                $apartament->setContact($page['contact']);
                $apartament->setDescription($page['description']);
                $this->em->persist($apartament);
            }

            $this->em->flush();
            $this->em->commit();

            $output->writeln("imported " . count($pages) . " apartaments!");
        } catch (\Exception $exception) {
            $this->em->rollBack();
            throw $exception;
        }

        return Command::SUCCESS;
    }
}