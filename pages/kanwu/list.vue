<template>
	<view class="container">
		<!-- 高斯模糊背景 -->
		<view class="animated-bg">
			<view class="gradient-blob"></view>
			<view class="gradient-blob two"></view>
			<view class="gradient-blob three"></view>
			<view class="gradient-blob four"></view>
			<view class="overlay"></view>
		</view>
		
		<!-- 返回按钮 -->
		        <view class="back-button" @tap="goBack">
		            <text class="back-icon">←</text>
		            <text class="back-text">返回</text>
		        </view>
		
		<!-- 头部区域 -->
		<view class="header">
			<text class="logo-text">单词识别助手</text>
			<text class="subtitle">上传单词图片，快速获取详细释义</text>
		</view>

		<!-- 上传区域 -->
		<view class="upload-section">
			<view class="upload-box" @tap="chooseImage" v-if="!tempFilePath">
				<text class="upload-icon">📷</text>
				<text class="upload-text">点击上传单词图片</text>
				<text class="upload-desc">支持拍照或从相册选择</text>
			</view>
			
			<view class="preview-box" v-else>
				<image :src="tempFilePath" mode="aspectFit" class="preview-image"/>
				<view class="action-buttons">
					<button class="action-btn cancel" @tap="cancelUpload">取消</button>
					<button class="action-btn confirm" @tap="analyzeImage">识别</button>
				</view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view class="loading-state" v-if="loading">
			<view class="pulse-loader">
				<view class="pulse"></view>
				<view class="pulse"></view>
				<view class="pulse"></view>
			</view>
			<text class="loading-text">正在识别中...</text>
		</view>

		<!-- 只有当有单词数据时才显示结果区域 -->
		<div class="word-info" v-if="wordInfo.word">
      <div class="word-header">
        <text class="word">{{ wordInfo.word }}</text>
        <text class="phonetic">{{ wordInfo.phonetic }}</text>
      </div>
      
      <div class="word-content">
        <div class="item">
          <text class="label">词性：</text>
          <text>{{ wordInfo.type }}</text>
        </div>
        
        <div class="item">
          <text class="label">中文含义：</text>
          <text>{{ wordInfo.meaning }}</text>
        </div>
        
        <div class="item">
          <text class="label">例句：</text>
          <text>{{ wordInfo.example }}</text>
        </div>
        
        <div class="item">
          <text class="label">相关词汇：</text>
          <text>{{ wordInfo.similar }}</text>
        </div>
      </div>
    </div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tempFilePath: '', // 临时图片路径
				loading: false,
				wordResult: null, // 模拟的识别结果
				// 模拟数据
				mockResult: {
					word: "Happiness",
					phonetic: "ˈhæpinəs",
					meanings: [
						{
							partOfSpeech: "名词",
							definition: "幸福；快乐；愉快；幸福感",
							example: "Money doesn't buy happiness."
						},
						{
							partOfSpeech: "名词",
							definition: "适当；恰当；正确",
							example: "She questioned the happiness of his choice of words."
						}
					]
				},
				ossConfig: {
					accessKeyId: 'LTAI5tPhLjHJX9rha2oHU5bi',
					accessKeySecret: 'nlBaum32RYwDhxbHbRF6APCoLxyH6L',
					bucket: 'kevinyang',
					region: 'oss-cn-shenzhen.aliyuncs.com', // 根据你的实际地区修改
					endpoint: 'https://kevinyang.oss-cn-shenzhen.aliyuncs.com',
				},
				cozeConfig: {
            		apiUrl: 'https://api.coze.cn/open_api/v2/chat',
            		token: 'pat_tUzMkWzqahm3OG3ZkRhs7IV4fgCX5EZskndtWO38qbTxZ7lEE6JFu3UqIiqH8ajw',
            		botId: '7476064956673294345',
            		userId: '29032201862555'
        		},
				wordInfo: {
					word: '',
					phonetic: '',
					meaning: '',
					example: '',
					similar: '',
					pronunciation: ''
				}
			}
		},
		methods: {
			// 返回上一页
			        goBack() {
			            uni.navigateBack({
			                delta: 1 // 返回的页面层数，1 表示返回上一页
			            });
			        },
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.tempFilePath = res.tempFilePaths[0];
					}
				});
			},
			// 取消上传
			cancelUpload() {
				this.tempFilePath = '';
				this.wordResult = null;
			},
			// Base64编码函数
			base64Encode(str) {
				const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
				let output = '';
				let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				let i = 0;
				
				while (i < str.length) {
					chr1 = str.charCodeAt(i++);
					chr2 = str.charCodeAt(i++);
					chr3 = str.charCodeAt(i++);
					
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					
					output = output +
						chars.charAt(enc1) + chars.charAt(enc2) +
						chars.charAt(enc3) + chars.charAt(enc4);
				}
				return output;
			},
			// 上传到OSS
			async uploadToOSS(filePath) {
				return new Promise((resolve, reject) => {
					const date = new Date();
					date.setHours(date.getHours() + 1); // 设置policy过期时间为1小时后
					const policyText = {
						expiration: date.toISOString(), // 设置过期时间
						conditions: [
							["content-length-range", 0, 5048576000] // 设置上传文件的大小限制
						]
					};
					
					// 生成policy，使用自定义的base64编码函数
					const policy = this.base64Encode(JSON.stringify(policyText));
					
					// 生成signature
					const signature = this.computeSignature(policy, this.ossConfig.accessKeySecret);
					
					// 生成文件名
					const fileName = `word_images/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
					
					uni.uploadFile({
						url: this.ossConfig.endpoint,
						filePath: filePath,
						name: 'file',
						formData: {
							key: fileName,
							policy: policy,
							OSSAccessKeyId: this.ossConfig.accessKeyId,
							signature: signature,
							success_action_status: '200'
						},
						success: (res) => {
							if (res.statusCode === 200) {
								const url = `https://${this.ossConfig.bucket}.${this.ossConfig.region}/${fileName}`;
								resolve(url);
							} else {
								uni.showToast({
									title: '上传失败',
									icon: 'none'
								});
								reject(new Error('上传失败'));
							}
						},
						fail: (err) => {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							});
							reject(err);
						}
					});
				});
			},
			// 计算签名
			computeSignature(policy, accessKeySecret) {
				// 由于uni-app环境中可能没有crypto-js，这里使用一个简单的方法来计算
				const hmac = function(key, str) {
					const crypto = require('crypto');
					const hmac = crypto.createHmac('sha1', key);
					hmac.update(str);
					return hmac.digest('base64');
				};
				
				return hmac(accessKeySecret, policy);
			},
			// 调用Coze API
			async callCozeAPI(imageUrl) {
				try {
					const response = await uni.request({
						url: this.cozeConfig.apiUrl,
						method: 'POST',
						header: {
							'Authorization': `Bearer ${this.cozeConfig.token}`,
							'Content-Type': 'application/json',
							'Accept': '*/*',
							'Host': 'api.coze.cn',
							'Connection': 'keep-alive'
						},
						data: {
							conversation_id: Date.now().toString(),
							bot_id: this.cozeConfig.botId,
							user: this.cozeConfig.userId,
							query: `请识别这张图片中的单词，图片地址是：${imageUrl}`,
							stream: false
						}
					});
					
					const responseData =  response;
					console.log(responseData)
					const result = JSON.parse(responseData[1].data.messages[1].content);	
					console.log(result)

					// 根据实际返回数据更新显示
					
							
					return result;
					
				} catch (error) {
					console.error('Coze API 调用失败:', error);
					uni.showToast({
						title: error.message || 'API调用失败',
						icon: 'none',
						duration: 3000
					});
					return null;
				}
			},
			// 修改原有的analyzeImage方法
			async analyzeImage() {
				this.loading = true;
				try {
					// 1. 上传图片到OSS
					const imageUrl = await this.uploadToOSS(this.tempFilePath);
					console.log(imageUrl)
					
					// 2. 调用Coze API
					const result = await this.callCozeAPI(imageUrl);
					console.log(result)
					
					// 3. 处理返回结果
					this.wordInfo = {
              			word: result.out2, // pear
              			phonetic: result.yinbiao, // 英/peə(r)/；美/per/
              			type: result.output, // 名词
              			meaning: result.out, // 梨
              			example: result.liju, // I like to eat pears.（我喜欢吃梨。）
              			similar: result.xiangsi // apple（苹果）、banana（香蕉）等，都属于水果类词汇
            		};
				} catch (error) {
					console.error('处理失败:', error);
				} finally {
					this.loading = false;
				}
			}
		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		position: relative;
		overflow: hidden;
		background: #f8f9fa;
	}

	.animated-bg {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		overflow: hidden;
		z-index: 0;
		background: linear-gradient(125deg, #00fff3, #ff00e6);
		animation: gradientBG 15s ease infinite;
	}

	.gradient-blob {
		position: absolute;
		width: 1000rpx;
		height: 1000rpx;
		background: linear-gradient(
			45deg,
			rgba(255, 49, 97, 0.5),
			rgba(255, 97, 162, 0.5)
		);
		border-radius: 50%;
		filter: blur(80px);
		animation: blob-movement 20s infinite linear,
				   color-shift 10s infinite alternate;
		opacity: 0.7;
		top: -300rpx;
		left: -300rpx;
	}

	.gradient-blob.two {
		background: linear-gradient(
			45deg,
			rgba(67, 206, 162, 0.5),
			rgba(24, 90, 157, 0.5)
		);
		animation: blob-movement-2 25s infinite linear,
				   color-shift-2 12s infinite alternate;
		animation-delay: -3s;
		top: 60%;
		left: 60%;
	}

	.gradient-blob.three {
		background: linear-gradient(
			45deg,
			rgba(255, 197, 84, 0.5),
			rgba(255, 159, 0, 0.5)
		);
		animation: blob-movement-3 30s infinite linear,
				   color-shift-3 8s infinite alternate;
		animation-delay: -5s;
		top: 40%;
		left: 30%;
	}

	.gradient-blob.four {
		background: linear-gradient(
			45deg,
			rgba(147, 88, 255, 0.5),
			rgba(19, 123, 255, 0.5)
		);
		animation: blob-movement-4 28s infinite linear,
				   color-shift-4 15s infinite alternate;
		animation-delay: -7s;
		top: 20%;
		left: 70%;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(20px);
	}

	@keyframes gradientBG {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes blob-movement {
		0% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		33% {
			transform: translate(300rpx, 200rpx) scale(1.2) rotate(120deg);
		}
		66% {
			transform: translate(-200rpx, 400rpx) scale(0.8) rotate(240deg);
		}
		100% {
			transform: translate(0, 0) scale(1) rotate(360deg);
		}
	}

	@keyframes blob-movement-2 {
		0% {
			transform: translate(0, 0) scale(1.1) rotate(0deg);
		}
		33% {
			transform: translate(-250rpx, -300rpx) scale(0.9) rotate(120deg);
		}
		66% {
			transform: translate(300rpx, -200rpx) scale(1.2) rotate(240deg);
		}
		100% {
			transform: translate(0, 0) scale(1.1) rotate(360deg);
		}
	}

	@keyframes blob-movement-3 {
		0% {
			transform: translate(0, 0) scale(0.9) rotate(0deg);
		}
		33% {
			transform: translate(400rpx, -100rpx) scale(1.1) rotate(120deg);
		}
		66% {
			transform: translate(-300rpx, 200rpx) scale(0.8) rotate(240deg);
		}
		100% {
			transform: translate(0, 0) scale(0.9) rotate(360deg);
		}
	}

	@keyframes blob-movement-4 {
		0% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		33% {
			transform: translate(-200rpx, 300rpx) scale(1.1) rotate(120deg);
		}
		66% {
			transform: translate(250rpx, -250rpx) scale(0.9) rotate(240deg);
		}
		100% {
			transform: translate(0, 0) scale(1) rotate(360deg);
		}
	}

	@keyframes color-shift {
		0% {
			background: linear-gradient(45deg, rgba(255, 49, 97, 0.5), rgba(255, 97, 162, 0.5));
		}
		100% {
			background: linear-gradient(45deg, rgba(255, 182, 193, 0.5), rgba(255, 20, 147, 0.5));
		}
	}

	@keyframes color-shift-2 {
		0% {
			background: linear-gradient(45deg, rgba(67, 206, 162, 0.5), rgba(24, 90, 157, 0.5));
		}
		100% {
			background: linear-gradient(45deg, rgba(0, 255, 255, 0.5), rgba(0, 128, 128, 0.5));
		}
	}

	@keyframes color-shift-3 {
		0% {
			background: linear-gradient(45deg, rgba(255, 197, 84, 0.5), rgba(255, 159, 0, 0.5));
		}
		100% {
			background: linear-gradient(45deg, rgba(255, 215, 0, 0.5), rgba(255, 140, 0, 0.5));
		}
	}

	@keyframes color-shift-4 {
		0% {
			background: linear-gradient(45deg, rgba(147, 88, 255, 0.5), rgba(19, 123, 255, 0.5));
		}
		100% {
			background: linear-gradient(45deg, rgba(138, 43, 226, 0.5), rgba(65, 105, 225, 0.5));
		}
	}

	/* 头部样式 */
	.header {
		padding: 60rpx 40rpx;
		text-align: center;
		z-index: 1;
		position: relative;
	}

	.logo-text {
		font-size: 48rpx;
		color: #1a1a1a;
		font-weight: 600;
		letter-spacing: 2rpx;
		text-shadow: 0 2px 4px rgba(255, 255, 255, 0.2);
	}

	.subtitle {
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.7);
		margin-top: 16rpx;
		display: block;
	}

	/* 上传区域样式 */
	.upload-section {
		padding: 40rpx;
		z-index: 2;
		position: relative;
	}

	.upload-box {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(20px);
		border-radius: 20rpx;
		padding: 60rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 2rpx dashed rgba(255, 255, 255, 0.5);
	}

	.upload-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
	}

	.upload-text {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 10rpx;
	}

	.upload-desc {
		font-size: 24rpx;
		color: rgba(0, 0, 0, 0.5);
	}

	.preview-box {
		width: 100%;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.preview-image {
		width: 100%;
		height: 400rpx;
		border-radius: 20rpx;
	}

	.action-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		gap: 20rpx;
	}

	.action-btn {
		flex: 1;
		padding: 20rpx;
		border-radius: 10rpx;
		text-align: center;
		font-size: 28rpx;
	}

	.action-btn.cancel {
		background: rgba(255, 255, 255, 0.3);
		color: #333;
	}

	.action-btn.confirm {
		background: linear-gradient(135deg, #7C3AED, #3B82F6);
		color: #fff;
	}

	.word-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}

	.phonetic {
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.6);
		margin-left: 20rpx;
	}

	.meanings {
		margin-top: 30rpx;
	}

	.meaning-item {
		margin-bottom: 20rpx;
	}

	.pos {
		font-size: 26rpx;
		color: #666;
		background: rgba(0, 0, 0, 0.1);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		margin-right: 10rpx;
	}

	.definition {
		font-size: 30rpx;
		color: #333;
		display: block;
		margin: 10rpx 0;
	}

	.example {
		font-size: 26rpx;
		color: #666;
		display: block;
		font-style: italic;
	}

	/* 加载动画 */
	.loading-state {
		padding: 60rpx;
		text-align: center;
	}

	.pulse-loader {
		display: flex;
		justify-content: center;
		gap: 12rpx;
	}

	.pulse {
		width: 16rpx;
		height: 16rpx;
		background: #fff;
		border-radius: 50%;
		animation: pulse 1.5s infinite ease-in-out;
	}

	.pulse:nth-child(2) { animation-delay: 0.2s; }
	.pulse:nth-child(3) { animation-delay: 0.4s; }

	@keyframes pulse {
		0%, 100% { transform: scale(0.5); opacity: 0.2; }
		50% { transform: scale(1); opacity: 1; }
	}

	.loading-text {
		color: rgba(255,255,255,0.7);
		font-size: 28rpx;
		margin-top: 20rpx;
		display: block;
	}

	/* 结果卡片 */
	.result-wrapper {
		padding: 40rpx;
	}

	.result-card {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(15px);
		border-radius: 20rpx;
		padding: 30rpx;
		border: 1px solid rgba(255, 255, 255, 0.3);
		animation: slideUp 0.3s ease;
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.back-button {
	    position: fixed;
	    top: 40rpx;
	    left: 20rpx;
	    display: flex;
	    align-items: center;
	    padding: 10rpx 20rpx;
	    background: rgba(255, 255, 255, 0.8);
	    border-radius: 50rpx;
	    backdrop-filter: blur(10px);
	    z-index: 999;
	    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	.back-icon {
	    font-size: 36rpx;
	    margin-right: 10rpx;
	    color: #333;
	}
	
	.back-text {
	    font-size: 28rpx;
	    color: #333;
	}

	.word-info {
		padding: 20px;
	}

	.word-header {
		margin-bottom: 20px;
	}

	.word {
		font-size: 24px;
		font-weight: bold;
		margin-right: 10px;
	}

	.phonetic {
		color: #666;
	}

	.item {
		margin-bottom: 15px;
	}

	.label {
		color: #333;
		font-weight: bold;
		margin-right: 10px;
	}
</style>
