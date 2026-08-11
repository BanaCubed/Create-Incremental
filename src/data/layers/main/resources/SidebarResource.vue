<template>
	<div class="sidebar-resource" :style="{ '--el-color': color }">
		<Resource :color="color" :resource="resource" /> <span>{{ resource.displayName }}</span
		><br /><span>{{ oomps.value }}</span>
	</div>
</template>

<script lang="tsx" setup>
import { Resource as ResourceType } from "features/resources/resource";
import Resource from "features/resources/Resource.vue";
import Decimal from "util/bignum";
import { Ref } from "vue";

defineProps<{
	color: string;
	oomps: Ref<string>;
	resource: ResourceType;
}>();
</script>

<style lang="css" scoped>
.sidebar-resource {
	background-color: rgb(from var(--el-color) r g b / 0.4);
	width: 300px;
	padding: 3px 8px 8px;
	border: 5px solid rgba(0, 0, 0, 0.25);
	text-align: left;
}
</style>
