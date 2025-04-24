import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class SafeRender extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Row Render Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="document-table-row error" role="row">
                    <div className="document-table-cell" role="cell" style={{ textAlign: 'center' }}>
                        {__('Error rendering document row.', 'bcgov-design-system')}
                        {process.env.NODE_ENV === 'development' && (
                            <pre>{this.state.error?.toString()}</pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SafeRender; 