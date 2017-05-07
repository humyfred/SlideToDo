# SlideToDo


## API
```html
    <script>
    new SlideToDo({
        parent: '#J_serviceList', // 列表组件Id
        target: '.J_touch_service', // 列表单元类名
        action: function(rebind){
          // ...

          rebind() // 如果action方法重新渲染了列表单元，可让插件重新渲染插件所需的条件
        }
      })
   </script>
```   