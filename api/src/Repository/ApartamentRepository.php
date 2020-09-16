<?php

namespace App\Repository;

use App\Entity\Apartament;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Apartament|null find($id, $lockMode = null, $lockVersion = null)
 * @method Apartament|null findOneBy(array $criteria, array $orderBy = null)
 * @method Apartament[]    findAll()
 * @method Apartament[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ApartamentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Apartament::class);
    }

    public function findByQuery($query)
    {
        ['rooms' => $rooms, 'price_from' => $price_from, 'price_to' => $price_to] = $query;

        $query = $this->createQueryBuilder('a');

        if (!empty($rooms)) {
            $query->andWhere('a.rooms = :rooms')->setParameter('rooms', $rooms);
        }

        if (!empty($price_from) && !empty($price_to)) {
            $query
                ->andWhere('a.price BETWEEN :price_from AND :price_to')
                ->setParameter('price_from', $price_from)
                ->setParameter('price_to', $price_to);
        } else if (!empty($price_from)) {
            $query->andWhere('a.price >= :price')->setParameter('price', $price_from);
        } else if (!empty($price_to)) {
            $query->andWhere('a.price <= :price')->setParameter('price', $price_to);
        };

        return $query->getQuery()->getResult();
    }
}
