import { addAlias } from 'module-alias';
import { join } from 'path';

// For development (when running ts-node)
if (process.env.NODE_ENV !== 'production') {
    addAlias('@', join(__dirname, '..'));
}