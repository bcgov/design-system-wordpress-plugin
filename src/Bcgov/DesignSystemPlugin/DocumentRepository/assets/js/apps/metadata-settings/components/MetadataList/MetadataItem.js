import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const MetadataItem = ({ children, onMoveUp, onMoveDown, index, total }) => (
    <div className="metadata-field-item">
        <div className="metadata-field-info">
            {children}
        </div>
        <div className="metadata-field-move-actions">
            {index > 0 && (
                <Button
                    variant="secondary"
                    onClick={onMoveUp}
                    className="move-up"
                    aria-label={__('Move Up', 'bcgov-design-system')}
                >
                    ↑
                </Button>
            )}
            {index < total - 1 && (
                <Button
                    variant="secondary"
                    onClick={onMoveDown}
                    className="move-down"
                    aria-label={__('Move Down', 'bcgov-design-system')}
                >
                    ↓
                </Button>
            )}
        </div>
    </div>
);

export default MetadataItem; 