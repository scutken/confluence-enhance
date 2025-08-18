(function() {
  'use strict';

  // 避免重复加载
  if (window.VditorToggle) return;

  window.VditorToggle = {
    init: function() {
      document.addEventListener('DOMContentLoaded', function () {
        VditorToggle.setup();
      });
    },
    showSvgModal: null, // 将在setup中设置

    // 创建必需的DOM元素
    createRequiredElements: function(pre) {
      // 创建切换按钮容器
      const toggleContainer = document.createElement('div');
      toggleContainer.className = 'vditor-toggle-container';

      // 创建切换按钮
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'toggleVditorBtn';
      toggleBtn.className = 'vditor-toggle-btn';
      toggleBtn.textContent = '显示 Markdown 渲染';

      // 创建Vditor内容容器
      const vditorContainer = document.createElement('div');
      vditorContainer.id = 'vditor-content';

      // 将按钮添加到容器
      toggleContainer.appendChild(toggleBtn);

      // 将容器插入到pre元素之前
      pre.parentNode.insertBefore(toggleContainer, pre);
      pre.parentNode.insertBefore(vditorContainer, pre.nextSibling);

      return { vditorContainer, toggleBtn, toggleContainer };
    },

    setup: function() {
      // 获取原始markdown文本块
      const pre = document.querySelector(
        '.conf-macro.output-block[data-macro-name=\'noformat\']'
      );

      if (!pre) {
        console.warn('VditorToggle: 未找到Confluence markdown内容块');
        return;
      }

      const markdown = pre.textContent.trim();
      if (!markdown) {
        console.warn('VditorToggle: markdown内容为空');
        return;
      }

      // 创建必需的DOM元素
      const { vditorContainer, toggleBtn, toggleContainer } = this.createRequiredElements(pre);

      let isVditorView = true;
      let isOutlineVisible = true;

      // 创建大纲开关组件
      function createOutlineToggleSwitch() {
        const switchContainer = document.createElement('div');
        switchContainer.className = 'vditor-outline-switch';
        switchContainer.style.display = 'none'; // 初始状态隐藏

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'outlineSwitch';
        checkbox.checked = true; // 默认开启

        const slider = document.createElement('span');
        slider.className = 'switch-slider';

        const label = document.createElement('label');
        label.htmlFor = 'outlineSwitch';
        label.textContent = '大纲';

        switchContainer.appendChild(label);
        switchContainer.appendChild(checkbox);
        switchContainer.appendChild(slider);

        return switchContainer;
      }

      // 生成带折叠功能和滚动跟踪的大纲
      function generateOutline(contentContainer, outlineContainer) {
        // 清空现有内容
        outlineContainer.innerHTML = '';

        // 添加标题
        const title = document.createElement('h3');
        title.textContent = '文档大纲';
        outlineContainer.appendChild(title);

        // 查找所有标题元素
        const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');

        if (headings.length === 0) {
          const noOutline = document.createElement('p');
          noOutline.textContent = '暂无大纲';
          noOutline.style.color = '#6a737d';
          noOutline.style.fontStyle = 'italic';
          outlineContainer.appendChild(noOutline);
          return;
        }

        // 构建层级结构
        const outlineStructure = buildOutlineStructure(headings);

        // 创建大纲列表
        const outlineList = createOutlineList(outlineStructure);
        outlineContainer.appendChild(outlineList);

        // 初始化滚动跟踪
        initScrollTracking(headings, outlineContainer);
      }

      // 构建大纲层级结构
      function buildOutlineStructure(headings) {
        const structure = [];
        const stack = [];

        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName.charAt(1));
          const text = heading.textContent.trim();
          const id = heading.id || `heading-${index}`;

          // 确保标题有 ID
          if (!heading.id) {
            heading.id = id;
          }

          const item = {
            level,
            text,
            id,
            element: heading,
            children: []
          };

          // 找到正确的父级
          while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
          }

          if (stack.length === 0) {
            structure.push(item);
          } else {
            stack[stack.length - 1].children.push(item);
          }

          stack.push(item);
        });

        return structure;
      }

      // 创建大纲列表
      function createOutlineList(structure, parentLevel = 0) {
        const list = document.createElement('ul');
        list.style.cssText = `
          margin: 0;
          padding: 0;
          list-style: none;
        `;

        structure.forEach(item => {
          const listItem = document.createElement('li');
          listItem.style.margin = '2px 0';

          // 创建标题容器
          const itemContainer = document.createElement('div');
          itemContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-left: ${parentLevel * 12}px;
          `;

          // 创建折叠按钮（只有有子项的才显示）
          if (item.children.length > 0) {
            const toggleBtn = document.createElement('span');
            toggleBtn.className = 'outline-toggle';
            toggleBtn.innerHTML = '▼';
            toggleBtn.style.cssText = `
              width: 12px;
              height: 12px;
              margin-right: 4px;
              cursor: pointer;
              font-size: 10px;
              color: #586069;
              transition: transform 0.2s ease;
              user-select: none;
            `;

            itemContainer.appendChild(toggleBtn);
          } else {
            // 占位符保持对齐
            const spacer = document.createElement('span');
            spacer.style.cssText = 'width: 16px; height: 12px; margin-right: 0px;';
            itemContainer.appendChild(spacer);
          }

          // 创建链接
          const link = document.createElement('a');
          link.href = `#${item.id}`;
          link.textContent = item.text;
          link.className = 'outline-link';
          link.setAttribute('data-target-id', item.id);
          link.style.cssText = `
            display: block;
            padding: 2px 8px;
            color: #586069;
            text-decoration: none;
            border-radius: 3px;
            font-size: 13px;
            line-height: 1.4;
            flex: 1;
            transition: all 0.2s ease;
          `;

          // 添加悬停效果
          link.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f6f8fa';
            this.style.color = '#0366d6';
          });

          link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
              this.style.backgroundColor = '';
              this.style.color = '#586069';
            }
          });

          // 点击滚动到对应位置
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById(item.id);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });

          itemContainer.appendChild(link);
          listItem.appendChild(itemContainer);

          // 创建子列表
          if (item.children.length > 0) {
            const childList = createOutlineList(item.children, parentLevel + 1);
            childList.className = 'outline-children';
            listItem.appendChild(childList);

            // 绑定折叠事件
            const toggleBtn = itemContainer.querySelector('.outline-toggle');
            toggleBtn.addEventListener('click', function() {
              const isCollapsed = childList.style.display === 'none';
              childList.style.display = isCollapsed ? 'block' : 'none';
              this.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)';
            });
          }

          list.appendChild(listItem);
        });

        return list;
      }

      // 初始化滚动跟踪
      function initScrollTracking(headings, outlineContainer) {
        let ticking = false;

        function updateActiveOutlineItem() {
          const windowHeight = window.innerHeight;

          let activeHeading = null;
          let minDistance = Infinity;

          // 找到最接近视口顶部的标题
          headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            const distance = Math.abs(rect.top);

            // 如果标题在视口上方或刚进入视口
            if (rect.top <= windowHeight * 0.3 && distance < minDistance) {
              minDistance = distance;
              activeHeading = heading;
            }
          });

          // 更新大纲中的活动状态
          const outlineLinks = outlineContainer.querySelectorAll('.outline-link');
          outlineLinks.forEach(link => {
            link.classList.remove('active');
            link.style.backgroundColor = '';
            link.style.color = '#586069';
          });

          if (activeHeading) {
            const activeLink = outlineContainer.querySelector(`[data-target-id="${activeHeading.id}"]`);
            if (activeLink) {
              activeLink.classList.add('active');
              activeLink.style.backgroundColor = '#0366d6';
              activeLink.style.color = 'white';
            }
          }

          ticking = false;
        }

        function onScroll() {
          if (!ticking) {
            requestAnimationFrame(updateActiveOutlineItem);
            ticking = true;
          }
        }

        // 绑定滚动事件
        window.addEventListener('scroll', onScroll, { passive: true });

        // 初始更新
        updateActiveOutlineItem();
      }



      // 仅为 Mermaid 生成的 SVG 添加放大功能
      function addMermaidSvgZoomFeature(container) {
        // 仅查找 class="language-mermaid" 容器内的 SVG 元素
        const mermaidContainers = container.querySelectorAll('.language-mermaid');

        mermaidContainers.forEach((mermaidContainer) => {
          const svgs = mermaidContainer.querySelectorAll('svg');

          svgs.forEach((svg) => {
            // 跳过已经处理过的 SVG
            if (svg.hasAttribute('data-zoom-enabled')) {
              return;
            }

            // 标记为已处理
            svg.setAttribute('data-zoom-enabled', 'true');

            // 设置 Mermaid 容器样式
            mermaidContainer.style.cssText += `
              text-align: center;
              margin: 12px auto;
              width: 90%;
              max-width: 900px;
              min-width: 300px;
            `;

            // 获取 SVG 的原始尺寸
            const svgRect = svg.getBoundingClientRect();
            const svgWidth = svg.viewBox?.baseVal?.width || svgRect.width || svg.width?.baseVal?.value || 800;
            const svgHeight = svg.viewBox?.baseVal?.height || svgRect.height || svg.height?.baseVal?.value || 600;

            // 计算显示尺寸 - 统一容器宽度，高度按比例缩放
            const maxHeight = 600;
            const containerWidth = mermaidContainer.clientWidth || container.clientWidth * 0.9;

            let displayHeight = svgHeight * (containerWidth / svgWidth);

            // 如果计算后的高度超过限制，按比例缩放
            if (displayHeight > maxHeight) {
              displayHeight = maxHeight;
            }

            // 添加 SVG 样式和交互 - 统一样式
            svg.style.cssText += `
              width: 100%;
              height: ${displayHeight}px;
              max-height: 600px;
              border: 1px solid #e1e4e8;
              border-radius: 6px;
              background: white;
              cursor: zoom-in;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              display: block;
              object-fit: contain;
            `;

            // 悬停效果
            svg.addEventListener('mouseenter', function() {
              this.style.transform = 'scale(1.02)';
              this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            });

            svg.addEventListener('mouseleave', function() {
              this.style.transform = 'scale(1)';
              this.style.boxShadow = 'none';
            });

            // 点击放大
            svg.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              showSvgModal(this);
            });

            // 添加悬停提示
            svg.title = '点击放大查看';
          });
        });
      }

      // 显示 SVG 放大模态框
      function showSvgModal(svg) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'svg-modal';
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          overflow: hidden;
        `;

        // 创建 SVG 容器
        const svgContainer = document.createElement('div');
        svgContainer.style.cssText = `
          position: relative;
          width: 90%;
          height: 90%;
          overflow: hidden;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          cursor: grab;
        `;

        // 克隆 SVG
        const clonedSvg = svg.cloneNode(true);
        clonedSvg.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.1s ease;
          transform-origin: center center;
          pointer-events: auto;
        `;

        svgContainer.appendChild(clonedSvg);

        // 创建重置按钮
        const resetButton = document.createElement('button');
        resetButton.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M3 21v-5h5"/>
          </svg>
        `;
        resetButton.title = '重置视图 (恢复到原始大小和位置)';
        resetButton.style.cssText = `
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 48px;
          height: 48px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
          color: #475569;
          font-size: 0;
          cursor: pointer;
          z-index: 10002;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
        `;

        resetButton.addEventListener('mouseenter', function() {
          this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 1))';
          this.style.transform = 'scale(1.1) translateY(-2px)';
          this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)';
          this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          this.style.color = '#334155';
        });

        resetButton.addEventListener('mouseleave', function() {
          this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))';
          this.style.transform = 'scale(1) translateY(0)';
          this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
          this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          this.style.color = '#475569';
        });

        resetButton.addEventListener('mousedown', function() {
          this.style.transform = 'scale(1.05) translateY(-1px)';
        });

        resetButton.addEventListener('mouseup', function() {
          this.style.transform = 'scale(1.1) translateY(-2px)';
        });

        // 防止修饰键造成的样式问题
        resetButton.addEventListener('focus', function() {
          // 保持一致的样式，不受focus状态影响
          this.blur();
        });

        resetButton.addEventListener('keydown', function(e) {
          // 防止键盘操作造成的样式变化
          e.preventDefault();
        });

        svgContainer.appendChild(resetButton);
        modal.appendChild(svgContainer);

        // 缩放和拖拽变量
        let scale = 1;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let translateX = 0;
        let translateY = 0;






        // 更新 SVG 变换
        function updateTransform() {
          clonedSvg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }

        // 重置视图到初始状态
        function resetView() {
          scale = 1;
          translateX = 0;
          translateY = 0;
          updateTransform();
          svgContainer.style.cursor = 'grab';
        }

        // 重置按钮点击事件
        resetButton.addEventListener('click', function(e) {
          e.stopPropagation();
          resetView();
        });



        // 滚轮缩放
        svgContainer.addEventListener('wheel', function(e) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? 0.9 : 1.1;
          const newScale = scale * delta;

          // 限制缩放范围
          if (newScale >= 0.5 && newScale <= 5) {
            // 获取鼠标位置相对于容器的坐标
            const rect = svgContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // 计算鼠标位置相对于容器中心的偏移
            const containerCenterX = rect.width / 2;
            const containerCenterY = rect.height / 2;
            const offsetX = mouseX - containerCenterX;
            const offsetY = mouseY - containerCenterY;

            // 计算缩放前鼠标位置在SVG坐标系中的位置
            const svgMouseX = (offsetX - translateX) / scale;
            const svgMouseY = (offsetY - translateY) / scale;

            // 更新缩放比例
            scale = newScale;

            // 计算新的位移，使鼠标位置保持不变
            translateX = offsetX - svgMouseX * scale;
            translateY = offsetY - svgMouseY * scale;

            updateTransform();
          }
        });

        // 双击放大功能
        clonedSvg.addEventListener('dblclick', function(e) {
          e.preventDefault();
          e.stopPropagation();

          if (scale === 1) {
            // 放大到2倍，并让点击位置居中
            const rect = svgContainer.getBoundingClientRect();

            // 计算点击位置相对于SVG中心的偏移
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const containerCenterX = rect.width / 2;
            const containerCenterY = rect.height / 2;

            // 计算点击位置相对于容器中心的偏移
            const offsetX = clickX - containerCenterX;
            const offsetY = clickY - containerCenterY;

            // 放大后，调整位移使点击位置居中
            scale = 2;
            translateX = -offsetX;
            translateY = -offsetY;
          } else {
            // 恢复到原始大小
            scale = 1;
            translateX = 0;
            translateY = 0;
          }
          updateTransform();
        });

        // 鼠标拖拽
        svgContainer.addEventListener('mousedown', function(e) {
          if (e.target === clonedSvg || e.target === svgContainer) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            svgContainer.style.cursor = 'grabbing';
            e.preventDefault();
          }
        });

        // 鼠标移动处理
        document.addEventListener('mousemove', function(e) {
          if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
          }
        });

        // 鼠标释放处理
        document.addEventListener('mouseup', function() {
          if (isDragging) {
            isDragging = false;
            svgContainer.style.cursor = 'grab';
          }
        });

        // 触摸设备支持
        let initialDistance = 0;
        let initialScale = 1;

        svgContainer.addEventListener('touchstart', function(e) {
          if (e.touches.length === 2) {
            // 双指缩放
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
              touch2.clientX - touch1.clientX,
              touch2.clientY - touch1.clientY
            );
            initialScale = scale;
          } else if (e.touches.length === 1) {
            // 单指拖拽
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX - translateX;
            startY = touch.clientY - translateY;
          }
          e.preventDefault();
        });

        svgContainer.addEventListener('touchmove', function(e) {
          if (e.touches.length === 2) {
            // 双指缩放
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
              touch2.clientX - touch1.clientX,
              touch2.clientY - touch1.clientY
            );
            const newScale = initialScale * (distance / initialDistance);

            if (newScale >= 0.5 && newScale <= 5) {
              scale = newScale;
              updateTransform();
            }
          } else if (e.touches.length === 1 && isDragging) {
            // 单指拖拽
            const touch = e.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            updateTransform();
          }
          e.preventDefault();
        });

        svgContainer.addEventListener('touchend', function() {
          isDragging = false;
        });

        // 清理函数
        function cleanup() {
          if (modal.parentNode) {
            document.body.removeChild(modal);
          }
        }

        // 点击模态框背景关闭
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            cleanup();
          }
        });

        // ESC 键关闭
        const handleEsc = function(e) {
          if (e.key === 'Escape') {
            cleanup();
            document.removeEventListener('keydown', handleEsc);
          }
        };
        document.addEventListener('keydown', handleEsc);

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          font-size: 20px;
          font-weight: bold;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        closeBtn.addEventListener('click', function() {
          cleanup();
        });

        modal.appendChild(closeBtn);
        document.body.appendChild(modal);


      }

      // 创建大纲容器
      function createOutlineContainer() {
        const outlineContainer = document.createElement('div');
        outlineContainer.id = 'vditor-outline';
        outlineContainer.className = 'vditor-outline';
        outlineContainer.style.cssText = `
          position: fixed;
          top: 15vh;
          right: 20px;
          width: 200px;
          max-height: 65vh;
          overflow-y: auto;
          background: #fff;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 1000;
          font-size: 14px;
          display: none;
        `;

        document.body.appendChild(outlineContainer);
        return outlineContainer;
      }

      // 初始化渲染
      function initVditorPreview() {
        if (markdown && !vditorContainer.hasChildNodes()) {
          // 创建大纲容器
          const outlineContainer = document.getElementById('vditor-outline') || createOutlineContainer();

          Vditor.preview(vditorContainer, markdown, {
            markdown: {
              toc: true,
              mark: true,
              footnotes: true,
              autoSpace: true,
            },
            math: {
              engine: 'KaTeX',
              inlineDigit: true,
            },
            hljs: {
              style: 'github',
              lineNumber: true,
            },
            mermaid: {
              enable: true,
              theme: 'default',
              cdn: 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'
            },
            anchor: 2,
            lang: 'zh_CN',
            theme: {
              current: 'light',
            },
            after: function() {
              // 渲染完成后生成大纲
              setTimeout(() => {
                generateOutline(vditorContainer, outlineContainer);
                outlineContainer.style.display = 'block';
              }, 100);

              // 延迟确保 Mermaid SVG 完全渲染后添加放大功能
              setTimeout(() => {
                addMermaidSvgZoomFeature(vditorContainer);
              }, 300);
            }
          });
        }
      }

      // 大纲切换逻辑
      function toggleOutline() {
        const outlineContainer = document.getElementById('vditor-outline');
        const outlineSwitch = document.getElementById('outlineSwitch');
        if (outlineContainer && outlineSwitch) {
          isOutlineVisible = outlineSwitch.checked;
          if (isOutlineVisible) {
            outlineContainer.style.display = 'block';
          } else {
            outlineContainer.style.display = 'none';
          }
        }
      }

      // 切换显示逻辑
      function toggleView() {
        const outlineContainer = document.getElementById('vditor-outline');
        const outlineSwitch = document.querySelector('.vditor-outline-switch');
        isVditorView = !isVditorView;
        if (isVditorView) {
          // 切换到预览模式
          pre.style.display = 'none';
          vditorContainer.style.display = 'block';
          toggleBtn.textContent = '显示原文';
          toggleBtn.style.backgroundColor = '#6c757d';

          // 显示大纲开关
          if (outlineSwitch) {
            outlineSwitch.style.display = 'inline-flex';
          }

          // 显示大纲（如果开关是开启状态）
          if (outlineContainer && isOutlineVisible) {
            outlineContainer.style.display = 'block';
          }

          initVditorPreview();
        } else {
          // 切换到原文模式
          vditorContainer.style.display = 'none';
          pre.style.display = '';
          toggleBtn.textContent = '显示预览';
          toggleBtn.style.backgroundColor = '#007bff';

          // 隐藏大纲相关
          if (outlineContainer) {
            outlineContainer.style.display = 'none';
          }
          if (outlineSwitch) {
            outlineSwitch.style.display = 'none';
          }
        }
      }

      if (pre) {
        // 创建并添加大纲开关组件
        const outlineSwitch = createOutlineToggleSwitch();
        toggleContainer.appendChild(outlineSwitch);

        // 绑定事件
        toggleBtn.addEventListener('click', toggleView);
        const checkbox = document.getElementById('outlineSwitch');
        const slider = outlineSwitch.querySelector('.switch-slider');
        const label = outlineSwitch.querySelector('label');

        if (checkbox) {
          checkbox.addEventListener('change', toggleOutline);
        }
        if (slider) {
          slider.addEventListener('click', function() {
            checkbox.checked = !checkbox.checked;
            toggleOutline();
          });
        }
        if (label) {
          label.addEventListener('click', function() {
            checkbox.checked = !checkbox.checked;
            toggleOutline();
          });
        }

        // 默认设置：隐藏原文，显示渲染
        pre.style.display = 'none';
        vditorContainer.style.display = 'block';
        toggleBtn.textContent = '显示原文';
        toggleBtn.style.backgroundColor = '#6c757d';
        outlineSwitch.style.display = 'inline-flex';
        initVditorPreview();
      } else {
        toggleBtn.style.display = 'none';
      }

      // 暴露showSvgModal函数供外部调用
      window.VditorToggle.showSvgModal = showSvgModal;
    }
  };
  
  // 自动初始化
  VditorToggle.init();
})();
