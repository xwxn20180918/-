<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList()">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table style="margin:15px 0 15px 0;width:100%;" :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.pay_status === 1">已付款</el-tag>
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">{{scope.row.is_send }}</template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | date-format }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="isShowEditAddress"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="isShowLocalhostAddress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 省市区县弹框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="removeFormValue"
    >
      <el-form :model="addressForm" :rules="addressFormRules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
          <el-cascader
            expand-trigger="hover"
            style="width:50%;"
            v-model="addressForm.address1"
            :options="cityData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流弹框 -->
    <el-dialog title="物流地址" :visible.sync="dialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in localhostData"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  data() {
    return {
      //订单列表
      orderList: [],
      //订单请求参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      //总页数
      total: 0,
      //是否显示修改地址对话框
      addressDialogVisible: false,
      //弹框数据对象
      addressForm: {
        address1: [],
        address2: ""
      },
      //弹框规则
      addressFormRules: {
        address1: [
          { required: true, message: "请输入省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      //省市县数据
      cityData,
      //是否显示物流地址对话框
      dialogVisible: false,
      //地址数据
      localhostData: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (data.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      this.$message.success("获取订单列表成功");
      this.orderList = data.data.goods;
      this.total = data.data.total;
      console.log(data.data);
    },
    //pagesize
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage;
      this.getOrderList();
    },
    //pagenum
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderList();
    },
    //点击实现修改地址弹框
    isShowEditAddress() {
      
      this.addressDialogVisible = true;
    },
    //重置表单数据
    removeFormValue() {
      this.$refs.ruleFormRef.resetFields();
    },
    //点击实现修改物流地址弹框
    async isShowLocalhostAddress() {
      //弹框的时候发起获取地址请求
      const { data } = await this.$http.get("/kuaidi/1106975712662");
      if (data.meta.status !== 200) {
        return this.$message.error("获取修改地址失败");
      }
      this.$message.success("获取成功");
      this.localhostData = data.data;
      this.dialogVisible = true;
      console.log(data);
    }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
