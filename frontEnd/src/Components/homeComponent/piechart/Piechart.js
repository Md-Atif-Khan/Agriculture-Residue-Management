import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
class Piechart extends React.Component {
   COLORS = ["#8884d8", "#82ca9d", "#FFBB28"];
   pieData = [
      {
         name: "Stalk and Straw",
         value: 54.75
      },
      {
         name: "Chaff Waste",
         value: 30.15
      },
      {
         name: "Bran Waste",
         value: 14.9
      },
      
   ];
   CustomTooltip = ({ active, payload, label }) => {
      if (active) {
         return (
         <div
            className="custom-tooltip"
            style={{
               backgroundColor: "#ffff",
               padding: "5px",
               border: "1px solid #cccc"
            }}
         >
            <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
         </div>
      );
   }
   return null;
};
render() {
   return (
      <PieChart width={630} height={350}>
      <Pie
         data={this.pieData}
         color="#000000"
         dataKey="value"
         nameKey="name"
         cx="50%"
         cy="50%"
         outerRadius={150}
         fill="#8884d8"
      >
         {this.pieData.map((entry, index) => (
            <Cell
               key={`cell-${index}`}
               fill={this.COLORS[index % this.COLORS.length]}
            />
         ))}
      </Pie>
      <Tooltip content={<this.CustomTooltip />} />
      <Legend />
      </PieChart>
      );
   }
}
export default Piechart;