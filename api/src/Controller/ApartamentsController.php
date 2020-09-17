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

        $page = (int)$request->query->get('page') ?: 1;
        $page_size = 20;

        $slice = array_slice($models, $page_size * ($page - 1), $page_size);

        return $this->json([
            'total' => count($models),
            'page' => $page,
            'pages' => ceil(count($models) / $page_size),
            'page_size' => $page_size,
            'items' => $slice
        ]);
    }
}