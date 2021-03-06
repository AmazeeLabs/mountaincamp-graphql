<?php

namespace Drupal\mountaincamp\GraphQL\Field\BasicPage;

use Drupal\graphql\GraphQL\CacheableLeafValue;
use Drupal\node\NodeInterface;
use Drupal\mountaincamp\GraphQL\Field\SelfAwareField;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Type\Scalar\StringType;

class BasicPageBodyField extends SelfAwareField {

  /**
   * {@inheritdoc}
   */
  public function resolve($value, array $args, ResolveInfo $info) {
    if ($value instanceof NodeInterface && $value->bundle() === 'page') {
      $field = $value->get('body');
      if ($first = $field->first()) {
        return $first->get('value')->getValue();
      }
    }

    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getType() {
    return new StringType();
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'body';
  }
}