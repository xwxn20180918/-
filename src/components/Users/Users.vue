<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryList.query" clearable @clear="getUsersList()">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!-- 得到当前的一行数据 -->
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="isShowMgState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 按钮组-->
          <!-- 修改按钮-->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editButton(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserinfo(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="success"
                icon="el-icon-setting"
                size="mini"
                @click="isShowDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryList.pagenum"
        :page-sizes="[1, 2, 4, 10]"
        :page-size="queryList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加按钮的弹框提示的显示隐藏 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
      <el-form
        :model="AddForm"
        :rules="FormRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="AddForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialog" width="50%" @close="editDialogClosed">
      <el-form :model="editData" :rules="editrules" ref="editDataRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserinfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="isShowDialogdialogVisible" width="50%" @close="closeUserinfo">
      <div>
        <p>当前用户：{{userinfo.username}}</p>
        <p>当前用户角色：{{userinfo.role_name}}</p>
        <p>
          分配的新角色：
          <el-select v-model="userinfocurrent" placeholder="请选择">
            <el-option
              v-for="item in userinfoList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialogdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserinfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        //合法的邮箱
        return callback();
      }
      callback(new Error("邮箱不合法"));
    };
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3-8]\d{9}$/;
      if (regMobile.test(value)) {
        //合法的邮箱
        return callback();
      }
      callback(new Error("手机号不合法"));
    };
    return {
      queryList: {
        //索引值
        query: "",
        //页码值
        pagenum: 1,
        //页码大小
        pagesize: 2
      },
      total: 0,
      usersList: [],
      dialogVisible: false, //默认不显示提示框
      AddForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      FormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 6, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editDialog: false, //默然不显示修改对话框
      editData: {
        
      }, //查询的用户数据
      editrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //默认分配角色对话框不显示
      isShowDialogdialogVisible: false,
      //需要被分配角色的用户信息
      userinfo: {},
      //分配角色数据列表
      userinfoList: [],
      //当前select要分配的角色 默认为空
      userinfocurrent: ""
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    //获取数据列表
    async getUsersList() {
      const { data } = await this.$http.get("users", {
        params: this.queryList
      });
      if (data.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.$message.success("获取成功", data);
      this.usersList = data.data.users;
      this.total = data.data.total;
      console.log(data);
    },
    //监听事件 pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryList.pagesize = newSize;
      this.getUsersList();
    },
    //监听事件 页码值改变的事件
    handleCurrentChange(newNum) {
      console.log(newNum);
      this.queryList.pagenum = newNum;
      this.getUsersList();
    },
    //发送修改用户状态请求
    async isShowMgState(userinfo) {
      console.log(userinfo);
      const { data } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (data.meta.status !== 200) {
        //没有修改数据库中的状态 但是界面的数据以经从false 变成了 true   所以还得重置回去
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("获取失败");
      }
      this.$message.success("更新成功");
    },
    //清空表单的值
    closeDialog() {
      this.$refs.ruleForm.resetFields();
    },
    //添加用户
    addUsers() {
      //先进行表单验证
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return;
        }
        //可以发送添加用户的网络请求
        const { data } = await this.$http.post("users", this.AddForm);
        if (data.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        //隐藏添加用户的提示框
        this.dialogVisible = false;
        //重新获取数据
        this.getUsersList();
      });
    },
    //查询用户信息
    async editButton(id) {
      //查询用户信息
      // console.log(id);
      const { data } = await this.$http.get("users/" + id);
      if (data.meta.status !== 200) {
        return this.$message.error("查询数据失败");
      }
      this.editData = data.data;
      console.log(this.editData)
      this.editDialog = true;
    },
    //修改表单关闭之后 重置用户信息
    editDialogClosed() {
      this.$refs.editDataRef.resetFields();
    },
    //修改用户信息并提交 首先进行 预验证
    editUserinfo() {
      this.$refs.editDataRef.validate(async valid => {
        if (!valid) {
          return;
        }
        //发起修改用户请求
        const { data } = await this.$http.put("users/" + this.editData.id, {
          email: this.editData.email,
          mobile: this.editData.mobile
        });
        // console.log(data)
        if (data.meta.status !== 200) {
          return this.$message.error("更新数据失败");
        }
        //关闭修改提示框
        this.editDialog = false;
        //重新获取数据
        this.getUsersList();
        //弹出提示
        this.$message.success("数据更新成功");
      });
    },
    //删除用户信息
    async deleteUserinfo(id) {
      console.log(id);
      //首先进行弹框确认是否删除 confirm 返回的是一个promise对象
      const deleteConfirm = await this.$confirm(
        "此操作将永久删除用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //点击取消 输出cancel
      //点击确定 输出confirm
      // console.log(deleteConfirm)
      if (deleteConfirm !== "confirm") {
        return this.$message.error("已取消删除");
      }
      // console.log('已删除')
      //发送删除用户请求
      const { data } = await this.$http.delete("users/" + id);
      if (data.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      //刷新页面
      this.getUsersList();
    },
    //点击显示分配角色对话框
    async isShowDialog(userinfo) {
      //获取当前所在行的信息保存到userinfo中
      this.userinfo = userinfo;
      //获取分配用户角色
      const { data } = await this.$http.get("roles");
      if (data.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.userinfoList = data.data;
      console.log(this.userinfoList);
      this.isShowDialogdialogVisible = true;
    },
    //点击按钮保存分配角色
    async saveUserinfo() {
      if (!this.userinfocurrent) {
        return this.$message.error("请选择要分配的角色");
      }
      //发送保存用户角色请求
      const { data } = await this.$http.put(`users/${this.userinfo.id}/role`, {
        rid: this.userinfocurrent
      });
      if (data.meta.status !== 200) {
        return this.$message.error("分配角色失败");
      }
      this.$message.success("分配角色成功");
      this.getUsersList();
      this.isShowDialogdialogVisible = false;
    },
    //监听分配角色对话的关闭事件  也就是初始化当前对话框
    closeUserinfo(){
      this.userinfocurrent = ''
      this.userinfo = {}
    }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.el-card {
  margin-top: 15px;
  box-shadow: 5px 5px 20px #fff !importent;

  .el-row {
    display: flex;
    justify-content: center;
  }

  .el-table {
    margin-top: 20px;
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
