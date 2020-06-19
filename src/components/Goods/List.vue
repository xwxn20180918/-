<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            width="30%"
            v-model="paramsStr.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addList">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe style="margin:15px 0 0 0;">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">{{scope.row.add_time | date-format}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeListId(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsStr.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="paramsStr.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品列表数据
      goodsList: [],
      //总页数
      total: 0,
      //params参数
      paramsStr: {
        query: "",
        pagenum: 1,
        pagesize: 5
      }
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data } = await this.$http.get("goods", {
        params: this.paramsStr
      });
      if (data.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      this.$message.success("获取商品数据成功");
      this.goodsList = data.data.goods;
      this.total = data.data.total;
      console.log(this.goodsList);
    },
    //当前的pagesize
    handleSizeChange(newPage) {
      this.paramsStr.pagesize = newPage;
      this.getGoodsList();
    },
    //当前的pagenum
    handleCurrentChange(NewNum) {
      this.paramsStr.pagenum = NewNum;
      this.getGoodsList();
    },
    //删除当前数据
    async removeListId(id) {
      //弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if(confirmResult !== 'confirm'){
        return this.$message.error('点击了取消')
      }
      //点击确定 发送删除请求
     const {data} = await this.$http.delete(`goods/${id}`)
     if(data.meta.status !== 200){
       return this.$message.error('删除失败')
     }
       this.$message.success('删除商品成功')
       this.getGoodsList()
    },
    //添加商品按钮 跳转路由
    addList(){
      this.$router.push('/add')
    }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
