import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ct74 } from './entity/ct74.entity';
import { Ph74 } from './entity/ph74.entity';
import { Ct00 } from '../gb-co-nganhang/entity/ct00.entity'
import { CreatePhieuNhapKhoDto } from './dto/create-phieunhapkho.dto';
import { UpdatePhieuNhapKhoDto } from './dto/update-phieunhapkho.dto';
import { QueryPhieuNhapKhoDto } from './dto/query-phieunhapkho.dto';

@Injectable()
export class PhieuNhapKhoService {
  constructor(
    @InjectRepository(Ct74)
    private readonly ct74Repository: Repository<Ct74>,
    @InjectRepository(Ph74)
    private readonly ph74Repository: Repository<Ph74>,
    @InjectRepository(Ct00)
    private readonly ct00Repository: Repository<Ct00>,
    private readonly dataSource: DataSource
  ) { }

  async create(createDto: CreatePhieuNhapKhoDto): Promise<{ ct74: Ct74[]; ph74: Ph74; ct00: Ct00[] }> {
    // Sinh mã stt_rec mới
    const stt_rec = await this.generateUniqueSttRec();
    let ph74Saved: Ph74 | null = null;
    let ct74Saved: Ct74[] = [];
    let ct00Saved: Ct00[] = [];

    try {
      await this.dataSource.query(
        `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
        ["PND", createDto.so_ct, stt_rec]
      );
      // Tạo ph74
      const ph74 = this.ph74Repository.create({
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
      await this.ph74Repository.insert(ph74);
      ph74Saved = ph74;
    } catch (error) {
      throw new Error('Create ph74 failed: ' + error.message);
    }

    try {
      // Tạo ct74 và ct00 cho từng dòng chi tiết
      ct74Saved = [];
      ct00Saved = [];
      if (Array.isArray(createDto.hang_hoa_list) && createDto.hang_hoa_list.length > 0) {
        for (let i = 0; i < createDto.hang_hoa_list.length; i++) {
          const item = createDto.hang_hoa_list[i];

          // ct74 - Fixed type conversions
          const ct74 = this.ct74Repository.create({
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
          await this.ct74Repository.insert(ct74);
          ct74Saved.push(ct74);

          // ct00 (dùng chung) - Fixed type conversions
          const ct00 = this.ct00Repository.create({
            stt_rec: stt_rec,
            stt_rec0: (i + 1).toString().padStart(3, '0'),
            ma_ct: 'PND',
            ngay_ct: createDto.ngay_ct ?? new Date(),
            so_ct: createDto.so_ct ?? '',
            dien_giai: createDto.dien_giai ?? '',
            tk: String(item.tk_vt ?? ''),         // Ensure string type
            // ma_vt: String(item.ma_vt ?? ''),      // Ensure string type
            // gia_nt: Number(item.gia ?? 0),        // Convert to number
            // gia: Number(item.gia ?? 0),           // Convert to number
            // tien_nt: Number(item.tien ?? 0),      // Convert to number
            // tien: Number(item.tien ?? 0),         // Convert to number
            // ma_kho: String(item.ma_kho_i ?? ''),  // Ensure string type
            ma_dvcs: 'CTY',
            status: '2',
          });
          await this.ct00Repository.insert(ct00);
          ct00Saved.push(ct00);
        }
      }
    } catch (error) {
      // Nếu lỗi khi tạo ct74/ct00 thì xóa ph74
      if (ph74Saved) await this.ph74Repository.delete({ stt_rec });
      throw new Error('Create ct74/ct00 failed: ' + error.message);
    }
    await this.dataSource.query(
      `EXEC [dbo].[INCTPND-Post] @stt_rec = '${stt_rec}'`
    );
    return { ct74: ct74Saved, ph74: ph74Saved, ct00: ct00Saved };
  }

  async findAll(query: QueryPhieuNhapKhoDto): Promise<{
    data: any[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;

    try {
      const queryBuilder = this.ph74Repository.createQueryBuilder('ph74');

      if (query.search) {
        const searchTerm = `%${query.search}%`;
        queryBuilder.andWhere(
          '(ph74.ong_ba LIKE :search OR ph74.ma_gd LIKE :search OR ph74.so_ct LIKE :search)',
          { search: searchTerm }
        );
      }

      const [ph74Records, total] = await queryBuilder
        .orderBy('ph74.stt_rec', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      // Build full records with ct74 and ct00
      const fullData = await Promise.all(
        ph74Records.map(async (ph) => {
          const ct74List = await this.ct74Repository.find({ where: { stt_rec: ph.stt_rec } });

          const hang_hoa_list = ct74List.map((item) => ({
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

  async findOne(stt_rec: string): Promise<Ph74 | null> {
    return this.ph74Repository.findOneBy({ stt_rec });
  }

  async update(
    stt_rec: string,
    updateDto: UpdatePhieuNhapKhoDto
  ): Promise<{ ct74: Ct74[]; ph74: Ph74 | null; ct00: Ct00[] }> {
    let ct74Saved: Ct74[] = [];
    let ct00Saved: Ct00[] = [];

    try {
      // Validate số chứng từ
      await this.dataSource.query(
        `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
        ["PND", updateDto.so_ct, stt_rec]
      );

      // Cập nhật PH74
      await this.ph74Repository.update({ stt_rec }, {
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

      const ph74 = await this.ph74Repository.findOneBy({ stt_rec });

      // Xóa dữ liệu cũ
      await this.ct74Repository.delete({ stt_rec });
      await this.ct00Repository.delete({ stt_rec });

      // Thêm lại ct74, ct00
      if (Array.isArray(updateDto.hang_hoa_list) && updateDto.hang_hoa_list.length > 0) {
        for (let i = 0; i < updateDto.hang_hoa_list.length; i++) {
          const item = updateDto.hang_hoa_list[i];

          const ct74 = this.ct74Repository.create({
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
          await this.ct74Repository.insert(ct74);
          ct74Saved.push(ct74);

          const ct00 = this.ct00Repository.create({
            stt_rec,
            stt_rec0: (i + 1).toString().padStart(3, '0'),
            ma_ct: 'PND',
            ngay_ct: updateDto.ngay_ct ?? new Date(),
            so_ct: updateDto.so_ct ?? '',
            dien_giai: updateDto.dien_giai ?? '',
            tk: String(item.tk_vt ?? ''),
            ma_dvcs: 'CTY',
            status: '2',
          });
          await this.ct00Repository.insert(ct00);
          ct00Saved.push(ct00);
        }
      }

      // Gọi thủ tục
      await this.dataSource.query(
        `EXEC [dbo].[INCTPND-Post] @stt_rec = '${stt_rec}'`
      );

      return { ct74: ct74Saved, ph74, ct00: ct00Saved };

    } catch (error) {
      throw new Error('Update PhieuNhapKho failed: ' + error.message);
    }
  }


  async remove(stt_rec: string): Promise<void> {
    try {
      await this.ct74Repository.delete({ stt_rec });
      await this.ct00Repository.delete({ stt_rec });
      await this.ph74Repository.delete({ stt_rec });
    } catch (error) {
      throw new Error('Remove PhieuNhapKho failed: ' + error.message);
    }
  }

  async generateUniqueSttRec(prefix = 'APND'): Promise<string> {
    try {
      const last = await this.ph74Repository.createQueryBuilder('ph74')
        .where("ph74.stt_rec LIKE :prefix", { prefix: `${prefix}%` })
        .orderBy('ph74.stt_rec', 'DESC')
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
        const found = await this.ph74Repository.findOneBy({ stt_rec });
        isExist = !!found;
        if (isExist) nextNumber++;
      } while (isExist);

      return stt_rec;
    } catch (error) {
      throw new Error('Generate stt_rec failed: ' + error.message);
    }
  }
}