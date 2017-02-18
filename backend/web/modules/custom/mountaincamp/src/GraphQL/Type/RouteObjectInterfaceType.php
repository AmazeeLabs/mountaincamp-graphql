<?php

namespace Drupal\mountaincamp\GraphQL\Type;

use Drupal\graphql\GraphQL\Type\AbstractInterfaceType;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityCanonicalUriField;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityPreferredUriField;
use Drupal\mountaincamp\GraphQL\ResolveHelper;

class RouteObjectInterfaceType extends AbstractInterfaceType  {

  /**
   * {@inheritdoc}
   */
  public function build($config) {
    $config->addField(new EntityCanonicalUriField());
    $config->addField(new EntityPreferredUriField());
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'RouteObjectInterface';
  }

  /**
   * {@inheritdoc}
   */
  public function resolveType($object) {
    return ResolveHelper::resolveType($object);
  }
}
