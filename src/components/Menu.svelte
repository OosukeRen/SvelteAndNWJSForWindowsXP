<script>
    /** Menu.svelte*/
    import { onMount } from "svelte";
  
      export let zIndex;
      export let options = [];
      export let hide;
      export let additionalStyle = {};
      export let isLeftSide = false;
      export let x;
      export let y;
      export let shouldBlur;
      export let hideTopBorder;
      export let level = 0;

      const menuId = ElementUtils.generateId();
      const menuElementSelector = `.${menuId}`;
      let menuWidth = 0;

      let handleMenuOptionClick = (/** @type {MouseEvent}*/ev, option) => {
          ev.stopPropagation();
  
          if(option.click) {
              option.click();
              hide();
          }
      }

      const calculateStyle = () => {
        let styleToReturn = `position: absolute; top: 0; left: calc(100% - ${x});`;
        
        if(level == 0) {
            styleToReturn = '';
            if(x) {
                styleToReturn += ` left: ${x}px;`;
            }

            if(y) {
                styleToReturn += ` top: ${y}px;`
            }
        }

        return styleToReturn;
      }
  
      let paddingLeftOffset = `calc(.5rem + 15rem)`;
      
      TODO(`Rework the context menu so that instead of showing submenus as a part of the component, 
      when hovering over an item that has subitems - call menu again, and have the "left/right" 
      calculation in the component in runtime, based on call coordinates.`);
      
      let arrowPositionsHaveLoaded = false;

      let newArrowPositionsByName = {

      };

      onMount(() => {
          let shadow = jQuery('.shadow')[0];
          shadow.addEventListener('contextmenu', (ev) => {
              ev.preventDefault();
              hide();
  
              let otherClickedEl = document.elementFromPoint(ev.clientX, ev.clientY);
              const newEvent = new MouseEvent('contextmenu', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  clientX: ev.clientX,
                  clientY: ev.clientY,
                  button: 2
              });
  
              if(otherClickedEl) {
                  otherClickedEl.dispatchEvent(newEvent);
              }
          })
  
          if(shouldBlur) {
              let menuBody = jQuery('.menu_body')[0];
              menuBody.addEventListener('mouseleave', hide);
          }
          
          const menuElementProperties = ElementUtils.getBoundingSize(menuElementSelector, {
            width: true,
            height: true,
            top: true,
            left: true
          }, false); // ALL IS IN REM

          let rightEnd = menuElementProperties.width + menuElementProperties.left;
          let bottomEnd = menuElementProperties.height + menuElementProperties.top;
          menuWidth = menuElementProperties.width;

          let screenHeight = screen.height // ElementUtils.getSizeInRems(screen.height);
          let screenWidth = screen.width // ElementUtils.getSizeInRems(screen.width);
        
          setTimeout(() => {
              let menuArrows = jQuery(`${menuElementSelector} > .single_menu_option > .arrow-placeholder`);
              menuArrows.toArray().forEach(menuArrow => {
                let arrowParameters = menuArrow.getBoundingClientRect();
                let optionName = menuArrow.getAttribute('_name');

                newArrowPositionsByName[optionName] = arrowParameters;
                // console.log(newArrowPositionsByName);
              })

              arrowPositionsHaveLoaded = true;
              console.log(newArrowPositionsByName, menuElementProperties);
          })

          if(screenHeight < bottomEnd) {
            y = y - menuElementProperties.height;
          };

          if(screenWidth < rightEnd) {
            if(level > 0 ){
                x = `198%`;
            } else {
                x = x - menuElementProperties.width;
            }
          };
      })
  </script>

    <div class="menu_body {menuId}" style="{calculateStyle()} {hideTopBorder ? 'border-top: none;' : ''}">
        {#each options as option}
            {#if option.separator}
                <div class="separator_line"></div>
            {:else}
                <button class="single_menu_option" on:click={(ev) => handleMenuOptionClick(ev, option)}>
                    {#if option.options && isLeftSide}
                        <div class="arrow-placeholder _is_left" _name={option.name}>
                            <div class="arrow-left">

                            </div>
                        </div>
                    {/if}

                    {option.label} {!option.options && !option.click ? '(TO DO)' : ''}

                    {#if option.options && !isLeftSide}
                    <div class="arrow-placeholder _is_right" _name={option.name}>
                        <div class="arrow-right">

                        </div>
                    </div>
                    {/if}
                    
                    {#if option.options && arrowPositionsHaveLoaded}
                    <div class="submenu_placeholder">
                        <svelte:self
                                x={newArrowPositionsByName[option.name].left || 0}
                                y={newArrowPositionsByName[option.name].top || 0}
                                options={option.options}
                                zIndex={zIndex + 1}
                                hide={hide}
                                level={level+1}
                        />
                    </div>
                    <!-- <Menu x={newArrowPositionsByName[option.name].left} y={newArrowPositionsByName[option.name].top} options={option.options} zIndex={zIndex+1} {hide}></Menu> -->
                        <!-- <div class="submenu_options {isLeftSide ? 'left': ''}">
                            {#each (option.options || []) as submenu}
                                <button class="single_menu_option" on:click={(ev) => handleMenuOptionClick(ev, submenu)}>
                                    {submenu.label} {!submenu.options && !submenu.click ? '(TO DO)' : ''}
                                </button>
                            {/each}
                        </div> -->
                    {/if}
                </button>
            {/if}
        {/each}
    </div>

  <style>
      .shadow {
          width: 100%;
          height: 100%;
          position: absolute;
      }
      
      .menu_body {
          background-color: white;
          display: flex;
          flex-direction: column;
          width: fit-content;
          /* box-shadow: rgba(71, 71, 71, 0.3) 2px 2px, rgba(80, 80, 80, 0.2) 4px 4px, rgba(97, 97, 97, 0.1) 6px 6px, rgba(160, 160, 160, 0.05) 8px 8px; */
          box-shadow: rgb(0 0 0 / 49%) 4px 4px 5px 0px;
          border: solid 1px gray;
          padding: .25rem;
          position: relative;
  
      }
  
      .single_menu_option {
          margin: 0;
          width: 15rem;
          text-align: -webkit-left;
          padding: 0.3rem 0.7rem 0.3rem 2rem;
          line-height: 1rem;
          border: none;
          position: relative;
          display: flex;
          color: var(--context_menu_item_color)
      }
  
      .single_menu_option:hover{
        background-color: var(--hovered_item_bg);
      }
  
      .single_menu_option.disabled {
          color: gray;
      }
  
      .single_menu_option:not(.disabled):hover {
          color: white;
      }
  
      .single_menu_option:not(.disabled):hover .submenu_options{
          display: initial;
      }
  
      .single_menu_option:not(.disabled):hover .arrow-right{
          border-left-color: white;
      }
  
      .single_menu_option:not(.disabled):hover .arrow-left {
          border-right-color: white;
      }
  
      .separator_line {
          width: 100%;
          height: 1px;
          background: var(--context_menu_separator_border_color);
          margin: .35rem 0rem .5rem 0;
      }
  
      .submenu_options {
          position: absolute;
          left: calc(100% - 0.8rem);
          border: solid 1px gainsboro;
          display: flex;
          flex-direction: column;
          top: 0;
          padding: .17rem;
          background: white;
          display: none;
          box-shadow: rgb(0 0 0 / 49%) 4px 4px 5px 0px;
          z-index: 60;
      }
  
      .submenu_options.left {
          left: calc(-100% - 0.35rem);
      }
      
      .arrow-left {
          border-right: .4rem solid black;
      }
  
      .arrow-left, .arrow-right {
          width: 0; 
          height: 0; 
          border-top: .4rem solid transparent;
          border-bottom: .4rem solid transparent;
      }
  
      .arrow-right {
          border-left: .4rem solid black;
      }
      .arrow-placeholder {
          position: absolute;
          display: ruby;
          right: 1rem;
        transform: translate(0, -50%);
        top: 50%;
      }
  
      .arrow-placeholder ._is_right {
          right: 1rem;
          margin-right: 1.3rem;
      }
  
      .arrow-placeholder ._is_left {
          left: 0;
          margin-left: .6rem;
      }

      .single_menu_option:hover > .submenu_placeholder_absolute {
        /* display: unset; */
        opacity: 100;

    }
    
    .submenu_placeholder_absolute {
        /* display: none; */
        opacity: 0;
        position: absolute;
        height: 1rem;
        transform: translate(0, -50%);
        top: 50%;
        left: -.3rem;
      }

      .submenu_placeholder_relative {
        /* display: none; */
        position: relative;
        width: 100%;
        height: 100%;
      }
  </style>