#!/bin/sh

set -e

cd /var/www/console

php bin/console doctrine:database:create --no-interaction --if-not-exists
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console app:realt.by