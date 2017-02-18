<?php

namespace Drupal\mountaincamp\GraphQL\Field\Common\Node;

use Drupal\graphql\GraphQL\CacheableLeafValue;
use Drupal\mountaincamp\GraphQL\Type\UserType;
use Drupal\node\NodeInterface;
use Drupal\mountaincamp\GraphQL\Field\SelfAwareField;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;

class NodeAuthorField extends SelfAwareField {

  /**
   * {@inheritdoc}
   */
  public function resolve($value, array $args, ResolveInfo $info) {
    if ($value instanceof NodeInterface) {
      return $value->getRevisionUser();
    }

    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getType() {
    return new UserType();
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'author';
  }
}