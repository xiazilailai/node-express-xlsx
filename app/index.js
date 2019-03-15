// created at 2019/03/15

const formItem = Vue.component("form-item", {
    data (){
        return {};
    },
    props: ["item"],
    template:`
    <div class="form-group">
        <label :for="item.key">{{item.text}}</label>
        <input v-model="item.value" :type="item.type === 'number' ? item.type : 'text'" :id="item.key" class="form-control"/>
    </div>`,
    mounted: function(){
        if(this.item.type === "time"){
            let item = this.item;
            $("#" + item.key)
            .datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 2,
                autoclose: true
            })
            .on('changeDate', function(){
                item.value = this.value;
            });
        }        
    }
});

const formGroup = Vue.component("form-group", {
    data (){
        return {};
    },
    props: ["param"],
    template: `
    <div class="col-xs-6">
        <form-item :item="param"></form-item>
    </div>`
});

const app = new Vue({
    el: "#app",
    data: {
        title: "web 表格应用",
        params: [
            {text: "序号", key: "SerialNumber", value: "", type: "text", unit: "", hide: true },
            {text: "问题", key: "Problem", value: "", type: "text", unit: "" },
            {text: "责任人", key: "Owner", value: "", type: "text", unit: "" },
            {text: "处理情况", key: "HandlingSituation", value: "", type: "text", unit: "" },
            {text: "备注", key: "Remarks", value: "", type: "text", unit: "" },
            {text: "开始时间", key: "StartTime", value: "", type: "time", unit: "" },
            {text: "预计完成时间", key: "PlanEndTime", value: "", type: "time", unit: "" },
            {text: "完成百分比", key: "PercentageOfCompletion", value: "", type: "number", unit: "%" },
        ],
        rows: []
    },
    computed: {
        params: function(){
            return this.params;
        }
    },
    methods: {
        addRow: function(){
            let length = this.rows.length;
            this.rows.push(this.params.map((p)=>{ return {
                v: p.value,
                u: p.unit
            }}));
            this.rows[length][0].v = length + 1;
            this.resetparams();
        },
        resetparams: function(){
            this.params.forEach((p) => { p.value = ""; });
        },
        exportXlsx: function(){
            const params = [];
            this.rows.forEach((row, i) => {
                params[i] = [];
                row.forEach((cell, j) => {
                    params[i][j] = cell.v ? cell.v + cell.u : "";
                });
            });
            console.log(params);
            // const formData = new FormData(document.getElementById("exportForm"));
            // formData.set("rows", params);
            document.getElementById("exportFormInput").value = JSON.stringify(params);
        }
    }
});
