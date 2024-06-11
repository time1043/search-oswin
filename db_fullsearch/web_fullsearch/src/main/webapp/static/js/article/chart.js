//加载chart
	function loadChart(id){
		 //模块化包引入
		 require.config({
            packages: [
                {
                    name: 'echarts',
                    location: root+'/js/echarts/src',
                    main: 'echarts'
                },
                {
                    name: 'zrender',
                    location: root+'/js/zrender/src',
                    main: 'zrender'
                }
            ]
        });
		//通过异步请求后台获取option		
		 $.ajax({
           url:root+"/goods/priceTrend/"+id,
           type:"get",
           data:{},
           dataType:'text',
           error: function(msg){  
        	   alert("操作提示", "请求chart配置信息出错！");
           },
           success: function(text) { 
        	   var option = eval('('+text+')')
	        	//使用
	       		require(
	       			[
	       				'echarts',
	       				'echarts/chart/bar',
	       				'echarts/chart/line',
	       				'echarts/chart/pie',
	       				'echarts/chart/gauge'
	       			],
	       			function(ec){
	       				var myChart = ec.init(document.getElementById('main'));
	       				//为echart加载数据
			           	myChart.setOption(option);
	       			}
	       		);
           }
       });
		//渲染整个文档，主要针对动态添加的div标签无法自动加载easyui样式
	}
	
	
	function showPrice(id){
		loadChart(id);
	}