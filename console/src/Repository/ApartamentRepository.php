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

    // /**
    //  * @return Apartament[] Returns an array of Apartament objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Apartament
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
