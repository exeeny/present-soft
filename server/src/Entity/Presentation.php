<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PresentationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PresentationRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['presentation']], order: ['createdAt' => 'DESC'])]
class Presentation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('presentation')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups('presentation')]
    private ?string $title = null;

    /**
     * @var Collection<int, Slide>
     */
    #[ORM\OneToMany(targetEntity: Slide::class, mappedBy: 'presentation', orphanRemoval: true)]
    #[Groups('presentation')]
    private Collection $slides;

    #[ORM\Column(nullable: true)]
    #[Groups('presentation')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 255)]
    #[Groups('presentation')]
    private ?string $owner = null;
    

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->slides = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Collection<int, Slide>
     */
    public function getSlides(): Collection
    {
        return $this->slides;
    }

    public function addSlide(Slide $slide): static
    {
        if (!$this->slides->contains($slide)) {
            $this->slides->add($slide);
            $slide->setPresentation($this);
        }

        return $this;
    }

    public function removeSlide(Slide $slide): static
    {
        if ($this->slides->removeElement($slide)) {
            // set the owning side to null (unless already changed)
            if ($slide->getPresentation() === $this) {
                $slide->setPresentation(null);
            }
        }

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getOwner(): ?string
    {
        return $this->owner;
    }

    public function setOwner(string $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    
}
