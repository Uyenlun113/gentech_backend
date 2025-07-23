import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ct84 } from './entity/ct84.entity';
import { Ph84 } from './entity/ph84.entity';
import { Ct00 } from '../gb-co-nganhang/entity/ct00.entity'
import { CreatePhieuXuatKhoDto } from './dto/create-phieuxuatkho.dto';
import { UpdatePhieuXuatKhoDto } from './dto/update-phieuxuatkho.dto';
import { QueryPhieuXuatKhoDto } from './dto/query-phieuxuatkho.dto';

@Injectable()
export class PhieuXuatKhoService {
  constructor(
    @InjectRepository(Ct84)
    private readonly ct84Repository: Repository<Ct84>,
    @InjectRepository(Ph84)
    private readonly ph84Repository: Repository<Ph84>,
    @InjectRepository(Ct00)
    private readonly ct00Repository: Repository<Ct00>,
    private readonly dataSource: DataSource
  ) { }

  async create(createDto: CreatePhieuXuatKhoDto): Promise<{ ct84: Ct84[]; ph84: Ph84; ct00: Ct00[] }> {
    // Sinh mã stt_rec mới
    const stt_rec = await this.generateUniqueSttRec();
    let ph84Saved: Ph84 | null = null;
    let ct84Saved: Ct84[] = [];
    let ct00Saved: Ct00[] = [];

    try {
      await this.dataSource.query(
        `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
        ["PND", createDto.so_ct, stt_rec]
      );
      // Tạo ph84
      const ph84 = this.ph84Repository.create({
        stt_rec: stt_rec,
        ma_ct: 'PND',
        ma_gd: createDto.ma_gd ?? '',
        ngay_ct: createDto.ngay_ct ?? new Date(),
        ngay_lct: createDto.ngay_lct ?? new Date(),
        so_ct: createDto.so_ct ?? '',
        ma_kh: createDto.ma_kh ?? '',
        ong_ba: createDto.ong_ba ?? '',
        dia_chi: createDto.dia_chi ?? '',
        dien_giai: createDto.dien_giai ?? '',
        t_so_luong: 0,
        ma_nt: createDto.ma_nt ?? '',
        ty_gia: createDto.ty_gia ?? 1,
        t_tien_nt: 0,
        t_tien: 0,
        date: new Date(),
        time: "",
        // user_id: "1",
        date0: new Date(),
        time0: "",
        // user_id0: "1",
        status: '2',
        ma_dvcs: 'CTY',
        ma_qs: createDto.ma_qs ?? '',
        ty_giaf: createDto.ty_gia ?? 1,
        hd_thue: '0',
      });
      await this.ph84Repository.insert(ph84);
      ph84Saved = ph84;
    } catch (error) {
      throw new Error('Create ph84 failed: ' + error.message);
    }

    try {
      // Tạo ct84 và ct00 cho từng dòng chi tiết
      ct84Saved = [];
      ct00Saved = [];
      if (Array.isArray(createDto.hang_hoa_list) && createDto.hang_hoa_list.length > 0) {
        for (let i = 0; i < createDto.hang_hoa_list.length; i++) {
          const item = createDto.hang_hoa_list[i];

          // ct84 - Fixed type conversions
          const ct84 = this.ct84Repository.create({
            stt_rec: stt_rec,
            stt_rec0: (i + 1).toString().padStart(3, '0'),
            ma_ct: 'PND',
            ngay_ct: createDto.ngay_ct ?? new Date(),
            so_ct: createDto.so_ct ?? '',
            ma_kho_i: item.ma_kho_i ?? '',
            ma_vt: item.ma_vt ?? '',
            tk_vt: item.tk_vt ?? '',
            ma_nx_i: item.ma_nx_i ?? '',
            so_luong: Number(item.so_luong ?? 0), // Convert to number
            gia_nt: Number(item.gia ?? 0),        // Convert to number
            gia: Number(item.gia ?? 0),           // Convert to number
            tien_nt: Number(item.tien ?? 0),      // Convert to number
            tien: Number(item.tien ?? 0),         // Convert to number
          });
          await this.ct84Repository.insert(ct84);
          ct84Saved.push(ct84);

          // ct00 (dùng chung) - Fixed type conversions
          const ct00 = this.ct00Repository.create({
            stt_rec: stt_rec,
            stt_rec0: (i + 1).toString().padStart(3, '0'),
            ma_ct: 'PND',
            ma_gd: createDto.ma_gd ?? '',
            ngay_ct: createDto.ngay_ct ?? new Date(),
            ngay_lct: createDto.ngay_lct,
            so_ct: createDto.so_ct ?? '',
            ong_ba: createDto.ong_ba ?? '',
            dien_giai: item.dien_giai ?? '',
            ma_nt: createDto.ma_nt ?? '',
            ty_gia: createDto.ty_gia ?? 1,
            ma_kh: createDto.ma_kh ?? '',
            ma_qs: createDto.ma_qs ?? '',
            nh_dk: "A01",
            tk: String(item.tk_vt ?? ''),
            tk_du: '',
            ps_no_nt: 0,
            ps_co_nt: 0,
            ty_gia_ht: 1,
            ty_gia_ht2: 1,
            ps_co: 0,
            ps_no: 0,
            ct_nxt: 0,
            ma_vv: "",
            status: '2',
            ma_dvcs: 'CTY',
            so_seri0: "",
            loai_ct: '2',
            dien_giai0: item.dien_giai ?? '',
            nh_dkc: 'A01',
          });
          await this.ct00Repository.insert(ct00);
          ct00Saved.push(ct00);
        }
      }
    } catch (error) {
      // Nếu lỗi khi tạo ct84/ct00 thì xóa ph84
      if (ph84Saved) await this.ph84Repository.delete({ stt_rec });
      throw new Error('Create ct84/ct00 failed: ' + error.message);
    }
    await this.dataSource.query(
      `EXEC [dbo].[INCTPXD-Post] @stt_rec = '${stt_rec}'`
    );
    return { ct84: ct84Saved, ph84: ph84Saved, ct00: ct00Saved };
  }

  async findAll(query: QueryPhieuXuatKhoDto): Promise<{
    data: any[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;

    try {
      const queryBuilder = this.ph84Repository.createQueryBuilder('ph84');

      if (query.search) {
        const searchTerm = `%${query.search}%`;
        queryBuilder.andWhere(
          '(ph84.ong_ba LIKE :search OR ph84.ma_gd LIKE :search OR ph84.so_ct LIKE :search)',
          { search: searchTerm }
        );
      }

      const [ph84Records, total] = await queryBuilder
        .orderBy('ph84.stt_rec', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      // Build full records with ct84 and ct00
      const fullData = await Promise.all(
        ph84Records.map(async (ph) => {
          const ct84List = await this.ct84Repository.find({ where: { stt_rec: ph.stt_rec } });

          const hang_hoa_list = ct84List.map((item) => ({
            ma_vt: item.ma_vt,
            ma_kho_i: item.ma_kho_i ?? '',
            ton_kho: item.so_luong ?? 0,
            so_luong: item.so_luong ?? 0,
            gia: item.gia ?? 0,
            tien: item.tien ?? 0,
            tk_vt: item.tk_vt ?? 0,
            ma_nx_i: item.ma_nx_i ?? 0,
          }));

          const tong_tien = hang_hoa_list.reduce((sum, tk) => sum + (tk.tien || 0), 0);

          return {
            ma_gd: ph.ma_gd,
            ma_kh: ph.ma_kh,
            stt_rec: ph.stt_rec,
            dia_chi: ph.dia_chi,
            mst: 0,
            ong_ba: ph.ong_ba,
            dien_giai: ph.dien_giai,
            ngay_ct: ph.ngay_ct?.toISOString().split('T')[0] ?? null,
            ngay_lct: ph.ngay_lct?.toISOString().split('T')[0] ?? null,
            ma_qs: ph.ma_qs,
            so_ct: ph.so_ct,
            ma_nt: ph.ma_nt,
            ty_gia: ph.ty_gia,
            time: ph.time,
            date: ph.date,
            ma_dvcs: ph.ma_dvcs,
            hang_hoa_list,
            tong_tien,
          };
        })
      );

      return {
        data: fullData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('FindAll GiayBaoCo failed: ' + error.message);
    }
  }

  async findOne(stt_rec: string): Promise<Ph84 | null> {
    return this.ph84Repository.findOneBy({ stt_rec });
  }

  async update(
    stt_rec: string,
    updateDto: UpdatePhieuXuatKhoDto
  ): Promise<{ ct84: Ct84[]; ph84: Ph84 | null; ct00: Ct00[] }> {
    let ct84Saved: Ct84[] = [];
    let ct00Saved: Ct00[] = [];

    try {
      // Validate số chứng từ
      await this.dataSource.query(
        `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
        ["PND", updateDto.so_ct, stt_rec]
      );

      // Cập nhật PH84
      await this.ph84Repository.update({ stt_rec }, {
        ma_ct: 'PND',
        ma_gd: updateDto.ma_gd ?? '',
        ngay_ct: updateDto.ngay_ct ?? new Date(),
        ngay_lct: updateDto.ngay_lct ?? new Date(),
        so_ct: updateDto.so_ct ?? '',
        ma_kh: updateDto.ma_kh ?? '',
        ong_ba: updateDto.ong_ba ?? '',
        dia_chi: updateDto.dia_chi ?? '',
        dien_giai: updateDto.dien_giai ?? '',
        ma_nt: updateDto.ma_nt ?? '',
        ty_gia: updateDto.ty_gia ?? 1,
        t_so_luong: 0,
        t_tien_nt: 0,
        t_tien: 0,
        date: new Date(),
        time: '',
        date0: new Date(),
        time0: '',
        status: '2',
        ma_dvcs: 'CTY',
        ma_qs: updateDto.ma_qs ?? '',
        ty_giaf: updateDto.ty_gia ?? 1,
        hd_thue: '0',
      });

      const ph84 = await this.ph84Repository.findOneBy({ stt_rec });

      // Xóa dữ liệu cũ
      await this.ct84Repository.delete({ stt_rec });
      await this.ct00Repository.delete({ stt_rec });

      // Thêm lại ct84, ct00
      if (Array.isArray(updateDto.hang_hoa_list) && updateDto.hang_hoa_list.length > 0) {
        for (let i = 0; i < updateDto.hang_hoa_list.length; i++) {
          const item = updateDto.hang_hoa_list[i];

          const ct84 = this.ct84Repository.create({
            stt_rec,
            stt_rec0: (i + 1).toString().padStart(3, '0'),
            ma_ct: 'PND',
            ngay_ct: updateDto.ngay_ct ?? new Date(),
            so_ct: updateDto.so_ct ?? '',
            ma_kho_i: item.ma_kho_i ?? '',
            ma_vt: item.ma_vt ?? '',
            tk_vt: item.tk_vt ?? '',
            ma_nx_i: item.ma_nx_i ?? '',
            so_luong: Number(item.so_luong ?? 0),
            gia_nt: Number(item.gia ?? 0),
            gia: Number(item.gia ?? 0),
            tien_nt: Number(item.tien ?? 0),
            tien: Number(item.tien ?? 0),
          });
          await this.ct84Repository.save(ct84);
          ct84Saved.push(ct84);

          const ct00 = this.ct00Repository.create({
            stt_rec: stt_rec,
            stt_rec0: (i + 1).toString().padStart(3, '0'),
            ma_ct: 'PND',
            ma_gd: updateDto.ma_gd ?? '',
            ngay_ct: updateDto.ngay_ct ?? new Date(),
            ngay_lct: updateDto.ngay_lct,
            so_ct: updateDto.so_ct ?? '',
            ong_ba: updateDto.ong_ba ?? '',
            dien_giai: item.dien_giai ?? '',
            ma_nt: updateDto.ma_nt ?? '',
            ty_gia: updateDto.ty_gia ?? 1,
            ma_kh: updateDto.ma_kh ?? '',
            ma_qs: updateDto.ma_qs ?? '',
            nh_dk: "A01",
            tk: String(item.tk_vt ?? ''),
            tk_du: '',
            ps_no_nt: 0,
            ps_co_nt: 0,
            ty_gia_ht: 1,
            ty_gia_ht2: 1,
            ps_co: 0,
            ps_no: 0,
            ct_nxt: 0,
            ma_vv: "",
            status: '2',
            ma_dvcs: 'CTY',
            so_seri0: "",
            loai_ct: '2',
            dien_giai0: item.dien_giai ?? '',
            nh_dkc: 'A01',
          });
          let data = await this.ct00Repository.save(ct00);
          ct00Saved.push(data);
        }
      }

      // Gọi thủ tục
      await this.dataSource.query(
        `EXEC [dbo].[INCTPXD-Post] @stt_rec = '${stt_rec}'`
      );

      return { ct84: ct84Saved, ph84, ct00: ct00Saved };

    } catch (error) {
      throw new Error('Update PhieuXuatKho failed: ' + error.message);
    }
  }


  async remove(stt_rec: string): Promise<void> {
    try {
      await this.ct84Repository.delete({ stt_rec });
      await this.ct00Repository.delete({ stt_rec });
      await this.ph84Repository.delete({ stt_rec });
    } catch (error) {
      throw new Error('Remove PhieuXuatKho failed: ' + error.message);
    }
  }

  async generateUniqueSttRec(prefix = 'APND'): Promise<string> {
    try {
      const last = await this.ph84Repository.createQueryBuilder('ph84')
        .where("ph84.stt_rec LIKE :prefix", { prefix: `${prefix}%` })
        .orderBy('ph84.stt_rec', 'DESC')
        .getOne();

      let nextNumber = 1;
      if (last && last.stt_rec && last.stt_rec.length > prefix.length) {
        const numPart = last.stt_rec.substring(prefix.length);
        const parsed = parseInt(numPart, 10);
        if (!isNaN(parsed)) nextNumber = parsed + 1;
      }

      let stt_rec: string;
      let isExist = true;
      do {
        stt_rec = `${prefix}${nextNumber.toString().padStart(7, '0')}`;
        const found = await this.ph84Repository.findOneBy({ stt_rec });
        isExist = !!found;
        if (isExist) nextNumber++;
      } while (isExist);

      return stt_rec;
    } catch (error) {
      throw new Error('Generate stt_rec failed: ' + error.message);
    }
  }
}