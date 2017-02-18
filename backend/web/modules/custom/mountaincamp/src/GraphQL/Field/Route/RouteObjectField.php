<?php

namespace Drupal\mountaincamp\GraphQL\Field\Route;

use Drupal\mountaincamp\GraphQL\Field\SelfAwareField;
use Drupal\mountaincamp\GraphQL\Type\RouteObjectInterfaceType;
use Drupal\mountaincamp\RouteObjectWrapper;
use Youshido\GraphQL\Execution\ResolveInfo;

class RouteObjectField extends SelfAwareField {

  /**
   * {@inheritdoc}
   */
  public function resolve($value, array $args, ResolveInfo $info) {
    if ($value instanceof RouteObjectWrapper) {
      return $value->getWrappedEntity();
    }

    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'object';
  }

  /**
   * {@inheritdoc}
   */
  public function getType() {
    return new RouteObjectInterfaceType();
  }
}