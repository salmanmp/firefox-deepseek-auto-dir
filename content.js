(function () {
    'use strict';

    function setDirectionForElements() {
        const selectors = [
            '[class*="ds-message"]',
            '[class*="ds-markdown"]',
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(element => {
            if (!element.hasAttribute('dir') &&
                element.textContent &&
                element.textContent.trim().length > 0) {

                const text = element.textContent.trim();
                if (containsRTL(text) || containsMixedText(text)) {
                    element.setAttribute('dir', 'rtl');
                }
                else {
                    element.removeAttribute('dir');
                }
            }
        });
    }

    function containsRTL(text) {
        const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return rtlRegex.test(text);
    }

    function containsMixedText(text) {
        const hasEnglish = /[a-zA-Z]/.test(text);
        const hasRTL = containsRTL(text);
        return hasEnglish && hasRTL;
    }

    setDirectionForElements();

    const observer = new MutationObserver(function (mutations) {
        let shouldUpdate = false;

        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        shouldUpdate = true;
                    }
                });
            }
        });

        if (shouldUpdate) {
            setTimeout(setDirectionForElements, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener('input', function (e) {
        if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
            setTimeout(setDirectionForElements, 500);
        }
    });

    console.log('AI Chat Dir Auto extension loaded successfully');
})();
