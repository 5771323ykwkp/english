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
			<text class="logo-text">AI Assistant</text>
			<text class="subtitle">智能学习英语，探索无限可能</text>
		</view>

		<!-- 搜索区域 -->
		<view class="search-section" :class="{ 'search-focused': isFocused }">
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input 
					class="search-input" 
					type="text" 
					v-model="searchQuery"
					placeholder="探索任何英语问题..."
					@focus="handleFocus"
					@blur="handleBlur"
					@confirm="handleSearch"
				/>
				<view v-if="searchQuery" @tap="clearSearch" class="clear-btn">
					<text class="clear-icon">✕</text>
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view 
			class="content-section" 
			scroll-y 
			:class="{ 'has-result': searchResult }"
		>
			<!-- 默认状态 -->
			<view class="welcome-section" v-if="!searchResult && !loading">
				<view class="feature-cards">
					<view class="feature-card">
						<text class="card-icon">💡</text>
						<text class="card-title">智能问答</text>
					</view>
					<view class="feature-card">
						<text class="card-icon">🎯</text>
						<text class="card-title">精准解析</text>
					</view>
					<view class="feature-card">
						<text class="card-icon">🚀</text>
						<text class="card-title">即时响应</text>
					</view>
				</view>

				<view class="quick-starts">
					<text class="section-title">快速开始</text>
					<view class="suggestion-chips">
						<text class="chip" @tap="useExample('讲解英语的发展历程')">英语简史</text>
						<text class="chip" @tap="useExample('如何有效的学习英语？')">英语学习方法</text>
						<text class="chip" @tap="useExample('如何提高学习效率？')">提高英语学习效率</text>
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
				<text class="loading-text">AI 思考中...</text>
			</view>

			<!-- 结果展示 -->
			<view class="result-wrapper" v-if="searchResult">
				<view class="result-card">
					<view class="result-header">
						<text class="ai-badge">AI</text>
						<text class="timestamp">{{new Date().toLocaleTimeString()}}</text>
					</view>
					<text class="result-text">{{searchResult}}</text>
				</view>

				<!-- 跟进问题 -->
				<view class="follow-up-section" v-if="followUpQuestions.length">
					<text class="section-title">延伸思考</text>
					<view class="follow-up-list">
						<view 
							class="follow-up-item" 
							v-for="(question, index) in followUpQuestions" 
							:key="index"
							@tap="useExample(question)"
						>
							<text class="follow-up-icon">❯</text>
							<text class="follow-up-text">{{question}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchQuery: '',
				searchResult: '',
				followUpQuestions: [],
				loading: false,
				isFocused: false,
				// Coze API 配置
				cozeConfig: {
					apiUrl: 'https://api.coze.cn/open_api/v2/chat',
					token: 'pat_tUzMkWzqahm3OG3ZkRhs7IV4fgCX5EZskndtWO38qbTxZ7lEE6JFu3UqIiqH8ajw', // 替换为您的访问令牌
					botId: '7381415127742038025', // 替换为您的机器人ID
					userId: '29032201862555' // 用户ID，可以根据需要修改
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
			handleFocus() {
				this.isFocused = true
			},
			handleBlur() {
				this.isFocused = false
			},
			clearSearch() {
				this.searchQuery = ''
				this.searchResult = ''
			},
			useExample(text) {
				this.searchQuery = text
				this.handleSearch()
			},
			async handleSearch() {
			    if (!this.searchQuery.trim()) {
			        uni.showToast({
			            title: '请输入搜索内容',
			            icon: 'none'
			        });
			        return;
			    }
			
			    this.loading = true;
			    this.followUpQuestions = [];
			
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
			                query: this.searchQuery,
			                stream: false
			            }
			        });
			
			        // 解析响应
			        const responseData = response[1].data; // 第二个元素才是实际数据
			        if (responseData.code === 0) {
			            const messages = responseData.messages || [];
			
			            // 只获取类型为 answer 的第一条消息作为核心回答
			            const answer = messages.find(msg => msg.type === 'answer');
			            if (answer) {
			                // 移除可能的 verbose 信息和系统提示
			                let cleanAnswer = answer.content
			                    .replace(/\{.*?\}/g, '') // 移除 JSON 格式的内容
			                    .replace(/\[.*?\]/g, '') // 移除方括号内的内容
			                    .trim();
			
			                this.searchResult = cleanAnswer;
			            }
			
			            // 获取跟进问题
			            const followUps = messages.filter(msg => msg.type === 'follow_up');
			            if (followUps.length > 0) {
			                this.followUpQuestions = followUps.map(q => q.content);
			            }
			        } else {
			            throw new Error('API 请求失败');
			        }
			    } catch (error) {
			        console.error('API Error:', error);
			        uni.showToast({
			            title: '搜索失败，请重试',
			            icon: 'none'
			        });
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

	/* 搜索框样式 */
	.search-section {
		padding: 20rpx 40rpx;
		position: relative;
		z-index: 2;
	}

	.search-box {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(20px);
		border-radius: 20rpx;
		padding: 24rpx 32rpx;
		display: flex;
		align-items: center;
		border: 1px solid rgba(255, 255, 255, 0.3);
		transition: all 0.3s ease;
	}

	.search-box:hover {
		background: rgba(255,255,255,0.15);
	}

	.search-input {
		flex: 1;
		margin: 0 20rpx;
		font-size: 32rpx;
		color: #1a1a1a;
		height: 48rpx;
		line-height: 48rpx;
	}

	.search-icon, .clear-icon {
		font-size: 32rpx;
		color: rgba(255,255,255,0.6);
	}

	/* 功能卡片 */
	.feature-cards {
		display: flex;
		justify-content: space-around;
		padding: 40rpx;
		gap: 20rpx;
	}

	.feature-card {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 16rpx;
		padding: 30rpx;
		text-align: center;
		flex: 1;
		border: 1px solid rgba(255, 255, 255, 0.3);
		transition: all 0.3s ease;
	}

	.feature-card:active {
		transform: scale(0.98);
		background: rgba(255,255,255,0.15);
	}

	.card-icon {
		font-size: 48rpx;
		margin-bottom: 16rpx;
		display: block;
	}

	.card-title {
		color: #fff;
		font-size: 28rpx;
	}

	/* 建议词条 */
	.quick-starts {
		padding: 40rpx;
	}

	.section-title {
		color: rgba(0, 0, 0, 0.7);
		font-size: 28rpx;
		margin-bottom: 20rpx;
		display: block;
	}

	.suggestion-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}

	.chip {
		background: rgba(255,255,255,0.1);
		padding: 16rpx 32rpx;
		border-radius: 100rpx;
		color: #fff;
		font-size: 28rpx;
		transition: all 0.3s ease;
	}

	.chip:active {
		background: rgba(255,255,255,0.2);
		transform: scale(0.98);
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

	.ai-badge {
		background: linear-gradient(135deg, #7C3AED, #3B82F6);
		color: #fff;
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
	}

	.timestamp {
		color: rgba(255,255,255,0.5);
		font-size: 24rpx;
	}

	.result-text {
		color: #1a1a1a;
		font-size: 30rpx;
		line-height: 1.6;
	}

	/* 跟进问题 */
	.follow-up-section {
		margin-top: 40rpx;
	}

	.follow-up-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.follow-up-item {
		background: rgba(255, 255, 255, 0.15);
		padding: 24rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	.follow-up-item:active {
		background: rgba(255,255,255,0.15);
		transform: translateX(10rpx);
	}

	.follow-up-icon {
		color: rgba(255,255,255,0.5);
		margin-right: 16rpx;
		font-size: 24rpx;
	}

	.follow-up-text {
		color: #1a1a1a;
		font-size: 28rpx;
	}

	@keyframes slideUp {
		from { 
			opacity: 0;
			transform: translateY(20rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.search-input::placeholder {
		color: rgba(0, 0, 0, 0.4);
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
</style>
