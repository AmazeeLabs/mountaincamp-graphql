<?php

namespace Drupal\mountaincamp\SchemaProvider;

use Drupal\graphql\SchemaProvider\SchemaProviderBase;
use Drupal\mountaincamp\GraphQL\Field\Root\HelloWorldField;
use Drupal\mountaincamp\GraphQL\Field\Root\RouteByPathField;

/**
 * Generates a GraphQL Schema.
 */
class SchemaProvider extends SchemaProviderBase {

  /**
   * {@inheritdoc}
   */
  public function getQuerySchema() {
    return [
      new RouteByPathField(),
      new HelloWorldField(),
    ];
  }
}
