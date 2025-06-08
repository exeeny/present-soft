<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SlideRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SlideRepository::class)]
#[ApiResource]
class Slide
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('presentation')]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups('presentation')]
    private ?string $content = null;

    #[ORM\ManyToOne(inversedBy: 'slides')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Presentation $presentation = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getPresentation(): ?Presentation
    {
        return $this->presentation;
    }

    public function setPresentation(?Presentation $presentation): static
    {
        $this->presentation = $presentation;

        return $this;
    }
}
