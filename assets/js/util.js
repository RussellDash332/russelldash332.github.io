(function($) {

	/**
	 * Generate an indented list of links from a nav. Meant for use with panel().
	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function() {

		var	$this = $(this);
			$a = $this.find('a'),
			b = [];

		$a.each(function() {

			var	$this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
					'class="link depth-' + indent + '"' +
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
					'<span class="indent-' + indent + '"></span>' +
					$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify an element.
	 * @param {object} userConfig User config.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

		// No elements?
			if (this.length == 0)
				return $this;

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).panel(userConfig);

				return $this;

			}

		// Vars.
			var	$this = $(this),
				$body = $('body'),
				$window = $(window),
				id = $this.attr('id'),
				config;

		// Config.
			config = $.extend({

				// Delay.
					delay: 0,

				// Hide panel on link click.
					hideOnClick: false,

				// Hide panel on escape keypress.
					hideOnEscape: false,

				// Hide panel on swipe.
					hideOnSwipe: false,

				// Reset scroll position on hide.
					resetScroll: false,

				// Reset forms on hide.
					resetForms: false,

				// Side of viewport the panel will appear.
					side: null,

				// Target element for "class".
					target: $this,

				// Class to toggle.
					visibleClass: 'visible'

			}, userConfig);

			// Expand "target" if it's not a jQuery object already.
				if (typeof config.target != 'jQuery')
					config.target = $(config.target);

		// Panel.

			// Methods.
				$this._hide = function(event) {

					// Already hidden? Bail.
						if (!config.target.hasClass(config.visibleClass))
							return;

					// If an event was provided, cancel it.
						if (event) {

							event.preventDefault();
							event.stopPropagation();

						}

					// Hide.
						config.target.removeClass(config.visibleClass);

					// Post-hide stuff.
						window.setTimeout(function() {

							// Reset scroll position.
								if (config.resetScroll)
									$this.scrollTop(0);

							// Reset forms.
								if (config.resetForms)
									$this.find('form').each(function() {
										this.reset();
									});

						}, config.delay);

				};

			// Vendor fixes.
				$this
					.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
					.css('-webkit-overflow-scrolling', 'touch');

			// Hide on click.
				if (config.hideOnClick) {

					$this.find('a')
						.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

					$this
						.on('click', 'a', function(event) {

							var $a = $(this),
								href = $a.attr('href'),
								target = $a.attr('target');

							if (!href || href == '#' || href == '' || href == '#' + id)
								return;

							// Cancel original event.
								event.preventDefault();
								event.stopPropagation();

							// Hide panel.
								$this._hide();

							// Redirect to href.
								window.setTimeout(function() {

									if (target == '_blank')
										window.open(href);
									else
										window.location.href = href;

								}, config.delay + 10);

						});

				}

			// Event: Touch stuff.
				$this.on('touchstart', function(event) {

					$this.touchPosX = event.originalEvent.touches[0].pageX;
					$this.touchPosY = event.originalEvent.touches[0].pageY;

				})

				$this.on('touchmove', function(event) {

					if ($this.touchPosX === null
					||	$this.touchPosY === null)
						return;

					var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
						diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
						th = $this.outerHeight(),
						ts = ($this.get(0).scrollHeight - $this.scrollTop());

					// Hide on swipe?
						if (config.hideOnSwipe) {

							var result = false,
								boundary = 20,
								delta = 50;

							switch (config.side) {

								case 'left':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
									break;

								case 'right':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
									break;

								case 'top':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
									break;

								case 'bottom':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
									break;

								default:
									break;

							}

							if (result) {

								$this.touchPosX = null;
								$this.touchPosY = null;
								$this._hide();

								return false;

							}

						}

					// Prevent vertical scrolling past the top or bottom.
						if (($this.scrollTop() < 0 && diffY < 0)
						|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

							event.preventDefault();
							event.stopPropagation();

						}

				});

			// Event: Prevent certain events inside the panel from bubbling.
				$this.on('click touchend touchstart touchmove', function(event) {
					event.stopPropagation();
				});

			// Event: Hide panel if a child anchor tag pointing to its ID is clicked.
				$this.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.removeClass(config.visibleClass);

				});

		// Body.

			// Event: Hide panel on body click/tap.
				$body.on('click touchend', function(event) {
					$this._hide(event);
				});

			// Event: Toggle.
				$body.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.toggleClass(config.visibleClass);

				});

		// Window.

			// Event: Hide on ESC.
				if (config.hideOnEscape)
					$window.on('keydown', function(event) {

						if (event.keyCode == 27)
							$this._hide(event);

					});

		return $this;

	};

	/**
	 * Apply "placeholder" attribute polyfill to one or more forms.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {

		// Browser natively supports placeholders? Bail.
			if (typeof (document.createElement('input')).placeholder != 'undefined')
				return $(this);

		// No elements?
			if (this.length == 0)
				return $this;

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).placeholder();

				return $this;

			}

		// Vars.
			var $this = $(this);

		// Text, TextArea.
			$this.find('input[type=text],textarea')
				.each(function() {

					var i = $(this);

					if (i.val() == ''
					||  i.val() == i.attr('placeholder'))
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('blur', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == '')
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('focus', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == i.attr('placeholder'))
						i
							.removeClass('polyfill-placeholder')
							.val('');

				});

		// Password.
			$this.find('input[type=password]')
				.each(function() {

					var i = $(this);
					var x = $(
								$('<div>')
									.append(i.clone())
									.remove()
									.html()
									.replace(/type="password"/i, 'type="text"')
									.replace(/type=password/i, 'type=text')
					);

					if (i.attr('id') != '')
						x.attr('id', i.attr('id') + '-polyfill-field');

					if (i.attr('name') != '')
						x.attr('name', i.attr('name') + '-polyfill-field');

					x.addClass('polyfill-placeholder')
						.val(x.attr('placeholder')).insertAfter(i);

					if (i.val() == '')
						i.hide();
					else
						x.hide();

					i
						.on('blur', function(event) {

							event.preventDefault();

							var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

							if (i.val() == '') {

								i.hide();
								x.show();

							}

						});

					x
						.on('focus', function(event) {

							event.preventDefault();

							var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

							x.hide();

							i
								.show()
								.focus();

						})
						.on('keypress', function(event) {

							event.preventDefault();
							x.val('');

						});

				});

		// Events.
			$this
				.on('submit', function() {

					$this.find('input[type=text],input[type=password],textarea')
						.each(function(event) {

							var i = $(this);

							if (i.attr('name').match(/-polyfill-field$/))
								i.attr('name', '');

							if (i.val() == i.attr('placeholder')) {

								i.removeClass('polyfill-placeholder');
								i.val('');

							}

						});

				})
				.on('reset', function(event) {

					event.preventDefault();

					$this.find('select')
						.val($('option:first').val());

					$this.find('input,textarea')
						.each(function() {

							var i = $(this),
								x;

							i.removeClass('polyfill-placeholder');

							switch (this.type) {

								case 'submit':
								case 'reset':
									break;

								case 'password':
									i.val(i.attr('defaultValue'));

									x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

									if (i.val() == '') {
										i.hide();
										x.show();
									}
									else {
										i.show();
										x.hide();
									}

									break;

								case 'checkbox':
								case 'radio':
									i.attr('checked', i.attr('defaultValue'));
									break;

								case 'text':
								case 'textarea':
									i.val(i.attr('defaultValue'));

									if (i.val() == '') {
										i.addClass('polyfill-placeholder');
										i.val(i.attr('placeholder'));
									}

									break;

								default:
									i.val(i.attr('defaultValue'));
									break;

							}
						});

				});

		return $this;

	};

	/**
	 * Moves elements to/from the first positions of their respective parents.
	 * @param {jQuery} $elements Elements (or selector) to move.
	 * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
	 */
	$.prioritize = function($elements, condition) {

		var key = '__prioritize';

		// Expand $elements if it's not already a jQuery object.
			if (typeof $elements != 'jQuery')
				$elements = $($elements);

		// Step through elements.
			$elements.each(function() {

				var	$e = $(this), $p,
					$parent = $e.parent();

				// No parent? Bail.
					if ($parent.length == 0)
						return;

				// Not moved? Move it.
					if (!$e.data(key)) {

						// Condition is false? Bail.
							if (!condition)
								return;

						// Get placeholder (which will serve as our point of reference for when this element needs to move back).
							$p = $e.prev();

							// Couldn't find anything? Means this element's already at the top, so bail.
								if ($p.length == 0)
									return;

						// Move element to top of parent.
							$e.prependTo($parent);

						// Mark element as moved.
							$e.data(key, $p);

					}

				// Moved already?
					else {

						// Condition is true? Bail.
							if (condition)
								return;

						$p = $e.data(key);

						// Move element back to its original location (using our placeholder).
							$e.insertAfter($p);

						// Unmark element as moved.
							$e.removeData(key);

					}

			});

	};

})(jQuery);

(function () {
	const root = document.documentElement;
	const saved = localStorage.getItem("theme");
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
	if (saved) root.dataset.theme = saved;
	else if (prefersDark) root.dataset.theme = "dark";

	const btn = document.createElement("button");
	btn.id = "theme-toggle";
	btn.setAttribute("aria-label", "Dark mode");
	btn.innerHTML = `
	  <div class="icon">
		<div class="moon"></div>
		<div class="sun"></div>
	  </div>
	`;
  
	btn.onclick = () => {
	  const isDark = root.dataset.theme === "dark";
	  root.dataset.theme = isDark ? "light" : "dark";
	  localStorage.setItem("theme", root.dataset.theme);
	};

	if (document.body) {
	  document.documentElement.appendChild(btn);
	} else {
	  window.addEventListener("DOMContentLoaded", () => {
		document.documentElement.appendChild(btn);
	  });
	}
})();

window.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const resetBtn = document.getElementById("search-reset");
    const articles = Array.from(document.querySelectorAll("#posts-container article"));
    const paginationContainer = document.getElementById("pagination-controls");
    const tagButtons = document.querySelectorAll(".tag-button");

    if (!searchBar) return;

    let currentPage = 1;
    const postsPerPage = 5;

    function filterPosts() {
        const query = searchBar.value.toLowerCase().trim();
        const queryWords = query.split(/\s+/).filter(w => w !== "");
        const activeBtn = document.querySelector(".tag-button.active");
        const activeCategory = activeBtn ? activeBtn.dataset.tag.toLowerCase() : "all";

        if (resetBtn) resetBtn.style.display = query.length > 0 ? "block" : "none";

        const filteredArticles = articles.filter(article => {
            const titleText = article.querySelector("h4")?.innerText.toLowerCase() || "";
            
            const articleDiv = article.querySelector("div");
            const paragraphs = articleDiv ? Array.from(articleDiv.querySelectorAll("p")) : [];
            const innerContent = paragraphs.length > 1 ? paragraphs[1].innerText.toLowerCase() : "";
            
            const articleTagBtns = Array.from(article.querySelectorAll(".tag-label-btn"));
            const articleTags = articleTagBtns.map(btn => btn.dataset.tag.toLowerCase());
            
            const searchableContent = `${titleText} ${innerContent} ${articleTags.join(" ")}`;

            // RELAXED MATCHING: 
            // Removed \b boundaries to allow partial word matching (e.g., "fenwi" matches "fenwick")
            const matchesSearch = queryWords.length === 0 || queryWords.every(word => {
                return searchableContent.includes(word);
            });
            
            const matchesCategory = (activeCategory === "all" || articleTags.includes(activeCategory));

            return matchesSearch && matchesCategory;
        });

        const totalPages = Math.ceil(filteredArticles.length / postsPerPage) || 1;
        if (currentPage > totalPages) currentPage = 1;

        articles.forEach(a => a.style.display = "none");
        const start = (currentPage - 1) * postsPerPage;
        filteredArticles.slice(start, start + postsPerPage).forEach(a => a.style.display = "");

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        const addBtn = (label, target, disabled, isArrow = false) => {
            const btn = document.createElement("button");
            btn.innerHTML = label;
            btn.className = `page-btn ${isArrow ? 'arrow' : ''} ${disabled ? 'disabled' : ''} ${target === currentPage && !isArrow ? 'active' : ''}`;
            btn.onclick = () => { 
                if (!disabled && label !== "...") { 
                    currentPage = target; 
                    filterPosts(); 
                    const targetEl = document.getElementById("pagination-controls");
                    if (targetEl) {
                        targetEl.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }
                } 
            };
            paginationContainer.appendChild(btn);
        };

        addBtn("Prev", currentPage - 1, currentPage === 1, true);

        const range = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) range.push(i);
        } else {
            range.push(1);
            if (currentPage > 2) range.push("...");
            if (currentPage !== 1 && currentPage !== totalPages) range.push(currentPage);
            if (currentPage < totalPages - 1) range.push("...");
            range.push(totalPages);
        }

        range.forEach(item => {
            if (item === "...") {
                addBtn("...", null, true);
            } else {
                addBtn(item, item, false);
            }
        });

        addBtn("Next", currentPage + 1, currentPage === totalPages, true);
    }

    searchBar.addEventListener("input", () => {
        currentPage = 1;
        filterPosts();
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            searchBar.value = "";
            currentPage = 1;
            filterPosts();
            searchBar.focus();
        });
    }

    tagButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tagButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentPage = 1;
            filterPosts();
        });
    });

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("tag-label-btn")) {
            searchBar.value = e.target.dataset.tag.toLowerCase();
            tagButtons.forEach(b => b.classList.toggle("active", b.dataset.tag === "all"));
            currentPage = 1;
            filterPosts();
        }
    });

    filterPosts();
});

window.addEventListener("DOMContentLoaded", () => {
    const modal = document.createElement("dialog");
    modal.id = "global-image-modal";
    modal.style.cssText = "border:none; background:transparent; padding:0; width:100vw; height:100vh; max-width:100vw; max-height:100vh; outline:none; overflow:hidden; box-sizing:border-box;";
    
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display:flex; align-items:center; justify-content:center; width:100%; height:100%; box-sizing:border-box; overflow:hidden; position:relative;";

    const modalImg = document.createElement("img");
    modalImg.id = "global-modal-img";
    modalImg.style.cssText = "display:block; max-width:95vw; max-height:95vh; object-fit:contain; border-radius:4px; cursor:grab; user-select:none; -webkit-user-drag:none; transform-origin: 0px 0px; position:absolute;";
    
    wrapper.appendChild(modalImg);
    modal.appendChild(wrapper);
    document.body.appendChild(modal);

    let currentScale = 1;
    let isDragging = false;
    let startX, startY;
    let translateX = 0, translateY = 0;
    let initialWidth = 0, initialHeight = 0;

    const clampTranslations = (x, y) => {
        const wrapperRect = wrapper.getBoundingClientRect();
        const scaledWidth = initialWidth * currentScale;
        const scaledHeight = initialHeight * currentScale;

        let minX, maxX, minY, maxY;

        if (scaledWidth <= wrapperRect.width) {
            minX = (wrapperRect.width - scaledWidth) / 2;
            maxX = minX;
        } else {
            minX = wrapperRect.width - scaledWidth;
            maxX = 0;
        }

        if (scaledHeight <= wrapperRect.height) {
            minY = (wrapperRect.height - scaledHeight) / 2;
            maxY = minY;
        } else {
            minY = wrapperRect.height - scaledHeight;
            maxY = 0;
        }

        return {
            x: Math.max(minX, Math.min(x, maxX)),
            y: Math.max(minY, Math.min(y, maxY))
        };
    };

    const updateTransform = () => {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    };

    const resetZoom = () => {
        currentScale = 1;
        modalImg.style.transform = "none";
        modalImg.style.left = "auto";
        modalImg.style.top = "auto";
        translateX = 0;
        translateY = 0;
        setTimeout(() => {
            const rect = modalImg.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            initialWidth = rect.width;
            initialHeight = rect.height;
            translateX = rect.left - wrapperRect.left;
            translateY = rect.top - wrapperRect.top;
            modalImg.style.left = "0px";
            modalImg.style.top = "0px";
            updateTransform();
        }, 0);
    };

    document.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG" && !e.target.closest("#global-image-modal")) {
            modalImg.src = e.target.src;
            modalImg.alt = e.target.alt;
            resetZoom();
            modal.showModal();
            document.body.style.overflow = "hidden"; 
        }
    });

    modalImg.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    modal.addEventListener("click", () => {
        modal.close();
        document.body.style.overflow = ""; 
    });

    modal.addEventListener("wheel", (e) => {
        e.preventDefault();
        
        const wrapperRect = wrapper.getBoundingClientRect();
        const mouseX = e.clientX - wrapperRect.left;
        const mouseY = e.clientY - wrapperRect.top;

        const imageX = (mouseX - translateX) / currentScale;
        const imageY = (mouseY - translateY) / currentScale;

        const zoomIntensity = 0.1;
        
        if (e.deltaY < 0) {
            currentScale += zoomIntensity;
        } else {
            currentScale -= zoomIntensity;
        }
        currentScale = Math.max(1, Math.min(currentScale, 6));

        let targetX = mouseX - imageX * currentScale;
        let targetY = mouseY - imageY * currentScale;

        const clamped = clampTranslations(targetX, targetY);
        translateX = clamped.x;
        translateY = clamped.y;

        updateTransform();
    }, { passive: false });

    modalImg.addEventListener("mousedown", (e) => {
        isDragging = true;
        modalImg.style.cursor = "grabbing";
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        let targetX = e.clientX - startX;
        let targetY = e.clientY - startY;

        const clamped = clampTranslations(targetX, targetY);
        translateX = clamped.x;
        translateY = clamped.y;

        updateTransform();
    });

    window.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = "grab";
        }
    });

    modal.addEventListener("cancel", () => {
        document.body.style.overflow = "";
    });
});