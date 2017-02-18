<?php

namespace Drupal\mountaincamp\GraphQL\Type;

use Drupal\graphql\GraphQL\Type\AbstractObjectType;
use Drupal\mountaincamp\GraphQL\Relay\Field\GlobalIdField;
use Drupal\mountaincamp\GraphQL\Relay\Type\NodeInterfaceType;

class UserType extends AbstractObjectType {

  /**
   * {@inheritdoc}
   */
  public function build($config) {
    $config->addField(new GlobalIdField('user'));
  }

  /**
   * {@inheritdoc}
   */
  public function getInterfaces() {
    return [
      new NodeInterfaceType(),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'User';
  }
}
