export const mergeRefs = (...refs) => {
    return (element) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') {
                ref(element);
            } else if (ref) {
                ref.current = element;
            }
        });
    }
};
