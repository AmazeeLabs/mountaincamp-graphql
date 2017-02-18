<?php

namespace Drupal\mountaincamp\GraphQL\Type;

use Drupal\graphql\GraphQL\Type\AbstractObjectType;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityCanonicalUriField;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityIdField;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityLabelField;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityPreferredUriField;
use Drupal\mountaincamp\GraphQL\Field\Common\Node\NodeAuthorField;
use Drupal\mountaincamp\GraphQL\Field\Common\Node\NodeChangedDateField;
use Drupal\mountaincamp\GraphQL\Field\Common\Node\NodeCreateDateField;
use Drupal\mountaincamp\GraphQL\Relay\Field\GlobalIdField;
use Drupal\mountaincamp\GraphQL\Relay\Type\NodeInterfaceType;

class ArticleType extends AbstractObjectType {

  /**
   * {@inheritdoc}
   */
  public function build($config) {
    $config->addField(new GlobalIdField('article'));
    $config->addField(new EntityCanonicalUriField());
    $config->addField(new EntityPreferredUriField());
    $config->addField(new EntityIdField());
    $config->addField(new EntityLabelField());
    $config->addField(new NodeChangedDateField());
    $config->addField(new NodeCreateDateField());
    $config->addField(new NodeAuthorField());
  }

  /**
   * {@inheritdoc}
   */
  public function getInterfaces() {
    return [
      new NodeInterfaceType(),
      new RouteObjectInterfaceType(),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'Article';
  }
}
