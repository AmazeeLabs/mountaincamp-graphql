<?php

namespace Drupal\mountaincamp\TypeResolver;

use Drupal\Core\TypedData\DataDefinitionInterface;
use Drupal\graphql\TypeResolver\TypeResolverInterface;
use Drupal\mountaincamp\GraphQL\Type\ArticleType;
use Drupal\mountaincamp\GraphQL\Type\BasicPageType;
use Drupal\mountaincamp\GraphQL\Type\CommentType;
use Drupal\mountaincamp\GraphQL\Type\ExplainingArticleType;
use Drupal\mountaincamp\GraphQL\Type\KeywordType;
use Drupal\mountaincamp\GraphQL\Type\LandingPageType;
use Drupal\mountaincamp\GraphQL\Type\PageType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\ChannelBoxParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\EmbedParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\FocusBoxParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\ImageParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\InfoBoxParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\LinkBoxParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\MinistageParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\TeaserParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\TextParagraphType;
use Drupal\mountaincamp\GraphQL\Type\Paragraph\VideoParagraphType;
use Drupal\mountaincamp\GraphQL\Type\PersonType;
use Drupal\mountaincamp\GraphQL\Type\ProductType;
use Drupal\mountaincamp\GraphQL\Type\RecipeType;
use Drupal\mountaincamp\GraphQL\Type\SponsorType;
use Drupal\mountaincamp\GraphQL\Type\UserType;

class TypeResolver implements TypeResolverInterface {

  /**
   * {@inheritdoc}
   */
  public function resolveRecursive(DataDefinitionInterface $definition) {
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function applies(DataDefinitionInterface $definition) {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function collectTypes() {
    return [
      // Route object types.
      new ArticleType(),
      new BasicPageType(),
      new UserType(),
    ];
  }
}
