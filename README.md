# SlideToDo
可做向左滑动删除

基于原生开发，可拓展为React、Vue的插件

## API
```html
    <script>
    new SlideToDo({
        parent: '#J_serviceList', // 列表组件Id
        target: '.J_touch_service', // 列表单元类名
        action: function(rebind){
          // ...

  		  rebind() // 如果action函数重新渲染列表组件，rebind函数能重新绑定元素
        }
      })
   </script>
```   
