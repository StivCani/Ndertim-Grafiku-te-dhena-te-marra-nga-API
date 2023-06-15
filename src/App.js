import React, { useEffect, useState } from 'react';
import axios from "axios";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";


function App() {


  const setupChart= async()=>{
      const usersData =  await (await axios.get(`https://jsonplaceholder.typicode.com/users`)).data;
      const postsData =  await (await axios.get(`https://jsonplaceholder.typicode.com/posts`)).data;
      const stats = [];
      usersData.forEach(user=>{
        const userPosts = postsData.filter(post=>post.userId === user.id).length;
        stats.push({category:user.username,value1:userPosts })
      })
      stats.sort((a,b)=>b-a);
      const data = stats.slice(0,5);
      let root = am5.Root.new('chartdiv')
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
  
      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout
        })
      );
  

  
      
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );
  
      
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          categoryField: "category"
        })
      );
      xAxis.data.setAll(data);
  
      
      let series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Series",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value1",
          categoryXField: "category"
        })
      );
      series1.data.setAll(data);
  
  
  
      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {}));
      legend.data.setAll(chart.series.values);
  }

  useEffect(() => {

    setupChart()

  }, []);



  return (
    <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
  );


}

export default App