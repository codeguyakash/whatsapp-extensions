function createCopyButton(messageText, targetElement) {
    // Remove any existing button
    let existingButton = document.getElementById("floating-copy-button");
    if (existingButton) existingButton.remove();

    // Create a new copy button
    const copyButton = document.createElement("button");
    copyButton.id = "floating-copy-button";
    copyButton.textContent = "Copy";

    // Style the button
    Object.assign(copyButton.style, {
        position: "absolute",
        padding: "5px 10px",
        left: "20px",
        backgroundColor: "rgb(247, 247, 247)",
        color: "rgb(0,0,0)",
        border: "none",
        fontSize: "14px",
        borderRadius: "25px",
        cursor: "pointer",
        zIndex: "1000",
    });

    // Position the button near the target element
    const rect = targetElement.getBoundingClientRect();
    copyButton.style.top = `${rect.top + window.scrollY}px`;
    copyButton.style.left = `${rect.right + 10 + window.scrollX}px`;

    // Add copy functionality
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(messageText).then(() => {
            alert("Message copied!");
            copyButton.remove();
        });
    });

    // Add the button to the body
    document.body.appendChild(copyButton);

    // Remove button on mouse leave
    const removeButton = () => {
        if (document.getElementById("floating-copy-button")) {
            document.getElementById("floating-copy-button").remove();
        }
    };
    targetElement.addEventListener("mouseleave", removeButton, { once: true });
    copyButton.addEventListener("mouseleave", removeButton, { once: true });
}

function handleMouseEnter(event) {
    const target = event.target;
    if (target.classList.contains("_ao3e") && target.classList.contains("selectable-text")) {
        const messageText = target.innerText || target.textContent;
        createCopyButton(messageText, target);
    }
}

// Event delegation for improved performance
document.body.addEventListener("mouseenter", handleMouseEnter, { capture: true });

// Observe dynamically loaded content with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.addEventListener("mouseenter", handleMouseEnter, { once: true });
        }
    });
});

// Observe only elements that match message span
function observeMessages() {
    const messageSpans = document.querySelectorAll("span._ao3e.selectable-text.copyable-text");
    messageSpans.forEach((span) => observer.observe(span));
}

// Initial detection
observeMessages();

// Observe mutations for new elements without running `detectMessages` repeatedly
const mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            observeMessages();
        }
    }
});

mutationObserver.observe(document.body, { childList: true, subtree: true });
