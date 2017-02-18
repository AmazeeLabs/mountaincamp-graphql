<?php

namespace Drupal\mountaincamp\GraphQL\Type;

use Drupal\graphql\GraphQL\Type\AbstractObjectType;
use Drupal\mountaincamp\GraphQL\Field\BasicPage\BasicPageBodyField;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityCanonicalUriField;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityIdField;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityLabelField;
use Drupal\mountaincamp\GraphQL\Field\Common\Entity\EntityPreferredUriField;
use Drupal\mountaincamp\GraphQL\Field\Common\Node\NodeChangedDateField;
use Drupal\mountaincamp\GraphQL\Field\Common\Node\NodeCreateDateField;
use Drupal\mountaincamp\GraphQL\Field\Root\HelloWorldField;
use Drupal\mountaincamp\GraphQL\Relay\Field\GlobalIdField;
use Drupal\mountaincamp\GraphQL\Relay\Type\NodeInterfaceType;

class BasicPageType extends AbstractObjectType {

  /**
   * {@inheritdoc}
   */
  public function build($config) {
    $config->addField(new GlobalIdField('basic-page'));
    $config->addField(new EntityCanonicalUriField());
    $config->addField(new EntityPreferredUriField());
    $config->addField(new EntityIdField());
    $config->addField(new EntityLabelField());
    $config->addField(new NodeChangedDateField());
    $config->addField(new NodeCreateDateField());
    $config->addField(new HelloWorldField());
    $config->addField(new BasicPageBodyField());
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
    return 'BasicPage';
  }
}
