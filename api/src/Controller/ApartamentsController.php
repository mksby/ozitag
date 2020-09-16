<?php

namespace App\Controller;

use App\Entity\Apartament;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

/** @Route("/api") */
class ApartamentsController extends AbstractController
{
    /**
     * @Route("/apartaments", methods={"GET", "POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function find(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $modelRepository = $em->getRepository(Apartament::class);

        $models = $modelRepository->findByQuery([
            'rooms' => $request->query->get('rooms'),
            'price_from' => $request->query->get('price_from'),
            'price_to' => $request->query->get('price_to')
        ]);

        return $this->json($models);
    }
}