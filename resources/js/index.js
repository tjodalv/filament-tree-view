import Sortable from 'sortablejs';
import $ from 'jquery';

document.addEventListener('alpine:initializing', () => {
    window.Alpine.data('sortableTree', (maxDepth) => ({
        maxDepth,
        init() {
            let nestedSortables = document.getElementsByClassName('js-sortable-group');
            for (let i = 0; i < nestedSortables.length; i++) {
                new Sortable(nestedSortables[i], {
                    group: 'nested',
                    animation: 150,
                    fallbackOnBody: true,
                    swapThreshold: 0.65,
                    draggable: '.js-sortable-item',
                    handle: '.js-sortable-handle',
                    onMove: (evt) => {
                        if (this.maxDepth >= 0 && this.getDepth(evt.related) > this.maxDepth) {
                            return false;
                        }
                    },
                    onSort: () => {
                        this.$wire.sortRows(elementsToArray($('#js-sortable-root-nodes')));
                    }
                });
            }
        },

        getDepth(el, depth = 0) {
            let parentEl = el.parentElement.closest('.js-sortable-item');
            if (parentEl) {
                return this.getDepth(parentEl, ++depth);
            }
            return depth;
        },
    }))

    function elementsToArray(element) {
        let elements = [];
        let items = element.children('.js-sortable-item');

        items.each(function () {
            let child = $(this);
            let id = child.attr('data-id');
            let childData = {id: id};
            let children = child.children('.js-sortable-group');

            if (children.length > 0) {
                childData.children = elementsToArray(children);
            }

            elements.push(childData);
        });

        return elements;
    }
})