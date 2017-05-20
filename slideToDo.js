(function(){
	function SlideToDo(options){
	  this.parent = document.querySelector(options.parent)
	  this.target = options.target
	  this.action = options.action
	  this.buttonWidth = options.buttonWidth || 70
	  this.$decorateStyle = this.decorateStyle
	  this.init()
	}

	SlideToDo.prototype = {
		constructor: SlideToDo,
		init: function() {
			this.decorateStyle(this.target, this.parent)
			this.bind(this.parent, 'click', this.slideAction.bind(this)) 
			this.bind(this.parent, 'touchstart', this.touchStart.bind(this))
			this.bind(this.parent, 'touchmove', this.touchMove.bind(this))
			this.bind(this.parent, 'touchend', this.touchEnd.bind(this))
			
		},
		bind: function(target, type, action) {
			if(target.addEventListener){
				target.addEventListener(type, action, false)
			}else if(target.attachEvent){
				target.attachEvent('on' + type, action.bind(target))
			}else {
				target['on' + type] = action
			}
		},
		touchStart: function(evt){
			var targetElement = isChildOfSlide(evt.target)
			if(!targetElement){
				this.targetElement = null ; // 阻止touchend
				return false; // 只阻止touchmove
			}

			if (evt.targetTouches.length > 1) {
				return false;
			}

			var touch = evt.targetTouches[0];
			this.targetElement = targetElement;
			this.touchStartX = touch.pageX;
			this.touchStartY = touch.pageY;
			this.slideAction = this.targetElement.nextElementSibling;
			this.LastTargetLeft = this.targetElement.offsetLeft;// 上一次点击左边距离
			this.LastSlideActionright = Number(this.slideAction.style.right.replace(/px/g,''))
			this.stopAutoScroll = true // 停止setTimeout自动滚动
		},
		touchMove: function(evt){
			if(this.targetElement !== isChildOfSlide(evt.target)){
				this.targetElement = null;
				return false; //
			}
			
			var touch = evt.targetTouches[0];
			var moveX = touch.pageX;

			var newLeft =  this.LastTargetLeft + moveX - this.touchStartX;
			if(newLeft < 0){
				this.targetElement.style.left = Math.abs(newLeft) > this.buttonWidth ? -1 * this.buttonWidth + 'px' : newLeft + 'px';
			}
			else{
				this.targetElement.style.left = '0px'
			}

			var slideRight = this.LastSlideActionright + this.touchStartX - moveX;
			if(slideRight < 0){
				this.slideAction.style.right = Math.abs(slideRight) > 70 ? '-70px' : slideRight  + 'px';
			}else{
				this.slideAction.style.right = '0px'
			}

			return true;
		},
		touchEnd: function(evt){
			if(!this.targetElement){
				return ;
			}

			var slideActionRight = Number(this.slideAction.style.right.replace(/px/g,''));

			if(Math.abs(this.LastTargetLeft - this.targetElement.offsetLeft) <= 10){
				this.targetElement.style.left = this.LastTargetLeft + 'px'
				this.slideAction.style.right = this.LastSlideActionright + 'px'
				return false;
			}

			this.stopAutoScroll = false // 取消停止setTimeout自动滚动

			var self = this
			if(this.LastTargetLeft < this.targetElement.offsetLeft){

				setTimeout(function(){
					if(self.targetElement && self.targetElement.offsetLeft < 0 && !self.stopAutoScroll){
						self.targetElement.style.left = ++self.targetElement.offsetLeft + 'px'
						self.slideAction.style.right = (slideActionRight--) + 'px'
						setTimeout(arguments.callee, 10)
					}
				},10)
			}else {
				setTimeout(function(){
					if(self.targetElement && self.targetElement.offsetLeft > -1 * self.buttonWidth && !self.stopAutoScroll){
						self.targetElement.style.left = --self.targetElement.offsetLeft + 'px'
						self.slideAction.style.right = (slideActionRight++) + 'px'
						setTimeout(arguments.callee, 10)
					}
				},10)
			}
		},
		decorateStyle: function(target, parent){
			var SlideBtn = '<a class="slideAction" style="background: #e84747;color: white;width: 70px;position: absolute;height: 100%;text-align: center;right: -70px;top: 0;display: flex;align-items: center;justify-content: center;">删除</a>'
			var targets = parent.querySelectorAll(target)
			for(var i =0,length =targets.length; i< length; i++){
				var height = targets[i].offsetHeight
				targets[i].outerHTML =  '<div style="position: relative;overflow: hidden;height:'+height+'px;"><div class="slideTarget" style="position: absolute;width: 100%;">' + targets[i].outerHTML + '</div>'  + SlideBtn + '</div>'
			}
			
			// parent.style.position = 'relative'
			// parent.style.overflow = 'hidden'
			// fixParentLength(parent)
		},
		slideAction: function(evt) {
			evt.stopImmediatePropagation()
			var className = evt.target.getAttribute('class')
			if(className && className.indexOf('slideAction')>-1){
				this.action.call(evt.target, this.decorateStyle.bind(this, this.target, this.parent))
			}
		}
	}

		function isChildOfSlide (child){
			var className = child.getAttribute('class')
			if(className && className.indexOf('slideTarget')>-1){
				return child
			}else if(child.parentElement.getAttribute('class') && child.parentElement.getAttribute('class').indexOf('slideTarget')>-1){
				return child.parentElement
			}else if(child.parentElement !== document.body){
				return isChildOfSlide(child.parentElement)
			}else {
				return false
			}
		}

		function fixParentLength (parent){
			if(parent.childElementCount > 0){
				var height = parent.children[0].offsetHeight
				parent.style.height = height * parent.childElementCount + 'px'
			}
		}
		window.SlideToDo = SlideToDo;
})();