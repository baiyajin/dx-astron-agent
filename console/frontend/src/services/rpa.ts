import { RpaDetailInfo, RpaFormInfo, RpaInfo } from '@/types/rpa';
import http from '@/utils/http';

export async function getRpaSourceList(): Promise<RpaInfo[]> {
  return await http.get(`/api/rpa/source/list`);
}

export async function createRpa(params: RpaFormInfo): Promise<unknown> {
  return await http.post(`/api/rpa`, params);
}

export async function getRpaDetail(
  id: number,
  params?: { name?: string }
): Promise<RpaDetailInfo> {
  return await http.get(`/api/rpa/${id}`, { params });
}

export async function updateRpa(
  id: number,
  params: RpaFormInfo
): Promise<unknown> {
  return await http.put(`/api/rpa/${id}`, params);
}

export async function deleteRpa(id: number): Promise<unknown> {
  return await http.delete(`/api/rpa/${id}`);
}

export async function getRpaList(params: {
  name?: string;
}): Promise<RpaInfo[]> {
  return await http.get(`/api/rpa/list`, { params });
}

// RPA平台管理相关API
export async function createRpaSource(params: Partial<RpaInfo>): Promise<RpaInfo> {
  return await http.post(`/api/rpa/source`, params);
}

export async function updateRpaSource(
  id: number,
  params: Partial<RpaInfo>
): Promise<RpaInfo> {
  return await http.put(`/api/rpa/source/${id}`, params);
}

export async function deleteRpaSource(id: number): Promise<void> {
  return await http.delete(`/api/rpa/source/${id}`);
}
