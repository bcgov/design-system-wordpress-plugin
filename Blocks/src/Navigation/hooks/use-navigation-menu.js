import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function useNavigationMenu(selectedMenuId = null) {
    const { menus, hasResolvedMenus } = useSelect((select) => {
        const { getEntityRecords, hasFinishedResolution } = select(coreStore);
        const query = { 
            per_page: -1,
            status: ['publish', 'draft'],
            order: 'asc',
            orderby: 'title'
        };
        
        return {
            menus: getEntityRecords('postType', 'wp_navigation', query),
            hasResolvedMenus: hasFinishedResolution('getEntityRecords', [
                'postType',
                'wp_navigation',
                query,
            ]),
        };
    }, []);

    // Get the selected menu's content
    const { selectedMenu, hasResolvedSelectedMenu } = useSelect(
        (select) => {
            if (!selectedMenuId) {
                return {
                    selectedMenu: null,
                    hasResolvedSelectedMenu: true,
                };
            }

            const { getEditedEntityRecord, hasFinishedResolution } = select(coreStore);
            
            return {
                selectedMenu: getEditedEntityRecord('postType', 'wp_navigation', selectedMenuId),
                hasResolvedSelectedMenu: hasFinishedResolution('getEditedEntityRecord', [
                    'postType',
                    'wp_navigation',
                    selectedMenuId,
                ]),
            };
        },
        [selectedMenuId]
    );

    return {
        menus,
        selectedMenu,
        hasResolvedMenus,
        hasResolvedSelectedMenu,
    };
}