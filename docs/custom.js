// console.log("--- Custom script loaded ---");
// document.body.style.border = "2px solid red";

// function setPackageNav() {
//   console.log("setPackageNav called");
//   const sidebarContent = document.getElementById('sidebar-content');
//   if (!sidebarContent) {
//     requestAnimationFrame(setPackageNav);
//     return;
//   }

//   const currentPath = window.location.pathname;
//   console.log("Current path:", currentPath);
//   const microSdksPathRegex = /^\/micro-sdks\/([^\/]+)/;
//   const match = currentPath.match(microSdksPathRegex);

//   // Restore original sidebar if it exists
//   if (window.originalSidebarHTML) {
//     sidebarContent.innerHTML = window.originalSidebarHTML;
//   } else {
//     window.originalSidebarHTML = sidebarContent.innerHTML;
//   }

//   if (match && match[1] && match[1] !== 'index') {
//     const packageNameSlug = match[1];
//     console.log("Package name slug:", packageNameSlug);

//     const listItems = sidebarContent.querySelectorAll('li[data-title]');
//     let targetListItem = null;

//     listItems.forEach(li => {
//       const dataTitle = li.getAttribute('data-title').toLowerCase().replace(/\s/g, '-');
//       if (dataTitle === packageNameSlug) {
//         targetListItem = li;
//       }
//     });

//     if (targetListItem) {
//       console.log("Found target list item:", targetListItem);
//       const packageNavContent = targetListItem.querySelector('ul');
//       if (packageNavContent) {
//         sidebarContent.innerHTML = '';
//         sidebarContent.appendChild(packageNavContent.cloneNode(true));
//       }
//     } else {
//       console.log("No target list item found for slug:", packageNameSlug);
//     }
//   }
// }

// // --- Observer logic ---
// let currentPath = window.location.pathname;
// function observeDOM() {
//   const observer = new MutationObserver(() => {
//     if (window.location.pathname !== currentPath) {
//       currentPath = window.location.pathname;
//       setPackageNav();
//     }
//   });

//   const bodyNode = document.body;
//   if (bodyNode) {
//     observer.observe(document.body, { childList: true, subtree: true });
//   }
// }

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', () => {
//     setPackageNav();
//     observeDOM();
//   });
// } else {
//   setPackageNav();
//   observeDOM();
// }

// // To remove the debug border later:
// // document.body.style.border = "none";
