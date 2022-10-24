module.exports = {
    QUERY_CUBO_VENTAS: `
    SELECT
    (SELECT
    case
        when _movimiento_ventas_detalle.nimporte_total = 0.0000 then _movimiento_ventas_detalle.nimporte_total
        else 0.00
    end as nimporte,
    case
        when _movimiento_ventas_detalle.nimporte_total = 0.0000 then _movimiento_ventas_detalle.nimporte_total
        else 0.00
    end as nimporte_us,
    _movimiento_ventas.cid_ofi as codigo_ofi,
    _movimiento_ventas.dfecha_documento as df_ref,
    case
        when _movimiento_ventas_detalle.nimporte_bruto = 0.00 then 0.00
        else Round(
            _movimiento_ventas_detalle.nimporte_descuento /(
                _movimiento_ventas_detalle.nimporte_bruto + _movimiento_ventas_detalle.nimporte_descuento
            ) * 100,
            2
        )
    end as nporc_descuento,
    rtrim(
        _movimiento_ventas_detalle.cpromoid + ' ' + ISNULL(_promociones.cnombrepromo, '')
    ) as Canasta,
    rtrim(
        isnull(_kits_cabecera.cpromoid, '') + ' ' + ISNULL(_promocionesK.cnombrepromo, '')
    ) as Promocion,
    _movimiento_ventas_detalle.carticulos_id,
    _articulos.carticulos_codigo_equipo as codigo_ean,
    _cliente.cruc_clie as Ruc,
    _cliente.cdocumento_dni as DNI,
    CAST(_movimiento_ventas.cdireccion as varchar(20)) as direccion,
    CAST(_movimiento_ventas.mobservaciones as char(200)) as Observaciones,
    _movimiento_ventas.calmacen_id,
    _movimiento_ventas_detalle.ctipo_documento_id,
    _movimiento_ventas_detalle.cnumero_documento_item,
    RTRIM(_movimiento_ventas_detalle.cserie_documento) + '-' + RTRIM(_movimiento_ventas_detalle.cnumero_documento) AS cnumero_documento,
    case
        when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then case
            when _movimiento_ventas.lcastigo = 0 then _movimiento_ventas_detalle.ncantidad_pedido
            else _movimiento_ventas_detalle.ncantidad_pedido *(
                case
                    when _movimiento_ventas_detalle.nfactor_conversion = 0 then _articulos.narticulos_factor_conversion
                    else _movimiento_ventas_detalle.nfactor_conversion
                end
            ) / _articulos.nfactor_a_venta
        end
        else case
            when _movimiento_ventas.lcastigo = 0 then _movimiento_ventas_detalle.ncantidad_pedido * -1
            else (
                _movimiento_ventas_detalle.ncantidad_pedido *(
                    case
                        when _movimiento_ventas_detalle.nfactor_conversion = 0 then _articulos.narticulos_factor_conversion
                        else _movimiento_ventas_detalle.nfactor_conversion
                    end
                ) / _articulos.nfactor_a_venta
            ) * -1
        end
    end as ncantidad_pedido,
    --_movimiento_ventas.cid_ofi as codigo_ofi,
    _movimiento_ventas.dfecha_documento,
    cast(
        year(_movimiento_ventas.dfecha_documento) as char(04)
    ) + right(
        '00' + rtrim(
            cast(
                month(_movimiento_ventas.dfecha_documento) as char(02)
            )
        ),
        2
    ) as cperiodo,
    Round(
        case
            when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then 1
            else -1
        end * (1 - _movimiento_ventas_detalle.lgratuito) * case
            when _movimiento_ventas.cid_moneda = 'D' then _movimiento_ventas_detalle.nimporte_bruto * _movimiento_ventas.nmonto_tipo_cambio
            else _movimiento_ventas_detalle.nimporte_bruto
        end,
        2
    ) AS nvalor_venta,
    Round(
        case
            when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then 1
            else -1
        end * (1 - _movimiento_ventas_detalle.lgratuito) * case
            when _movimiento_ventas.cid_moneda = 'D' then _movimiento_ventas_detalle.nivg_importe * _movimiento_ventas.nmonto_tipo_cambio
            else _movimiento_ventas_detalle.nivg_importe
        end,
        2
    ) AS nigv,
    case
        when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then case
            when _movimiento_ventas.cid_moneda = 'D' then _movimiento_ventas_detalle.nimporte_total * _movimiento_ventas.nmonto_tipo_cambio
            else _movimiento_ventas_detalle.nimporte_total
        end
        else case
            when _movimiento_ventas.cid_moneda = 'D' then (
                _movimiento_ventas_detalle.nimporte_total * _movimiento_ventas.nmonto_tipo_cambio
            ) * -1
            else (_movimiento_ventas_detalle.nimporte_total * -1)
        end
    end AS nimporte_total,
    case
        when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then case
            when _movimiento_ventas.cid_moneda = 'N' then _movimiento_ventas_detalle.nimporte_total / _movimiento_ventas.nmonto_tipo_cambio
            else _movimiento_ventas_detalle.nimporte_total
        end
        else case
            when _movimiento_ventas.cid_moneda = 'N' then (
                _movimiento_ventas_detalle.nimporte_total / _movimiento_ventas.nmonto_tipo_cambio
            ) * -1
            else (_movimiento_ventas_detalle.nimporte_total * -1)
        end
    end as nimporte_total_dolar,
    _movimiento_ventas.nid_cia,
    RTRIM(_movimiento_ventas_detalle.carticulos_id) + '-' + RTRIM(_articulos.carticulos_nombre) + ' ' + RTRIM(_articulos.carticulos_forma_presentacion) AS articulo,
    _articulos.nfactor_a_venta,
    _articulos.narticulos_factor_conversion,
    case
        when _articulos.narticulos_factor_conversion != 0 then case
            when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then case
                when _movimiento_ventas.lcastigo = 0 then case
                    when _articulos.nfactor_a_venta != 0 then (
                        (
                            _articulos.nfactor_a_venta /(
                                case
                                    when _movimiento_ventas_detalle.nfactor_conversion = 0 then _articulos.narticulos_factor_conversion
                                    else _movimiento_ventas_detalle.nfactor_conversion
                                end
                            )
                        ) * _movimiento_ventas_detalle.ncantidad_pedido
                    ) / _articulos.nfactor_a_venta
                    else 0.00
                end
                else case
                    when _articulos.nfactor_a_venta != 0 then _movimiento_ventas_detalle.ncantidad_pedido / _articulos.nfactor_a_venta
                    else 0.00
                end
            end
            else case
                when _movimiento_ventas.lcastigo = 0 then case
                    when _articulos.nfactor_a_venta != 0 then (
                        (
                            (
                                _articulos.nfactor_a_venta /(
                                    case
                                        when _movimiento_ventas_detalle.nfactor_conversion = 0 then _articulos.narticulos_factor_conversion
                                        else _movimiento_ventas_detalle.nfactor_conversion
                                    end
                                )
                            ) * _movimiento_ventas_detalle.ncantidad_pedido
                        ) * -1
                    ) / _articulos.nfactor_a_venta
                    else 0.00
                end
                else case
                    when _articulos.nfactor_a_venta != 0 then ((_movimiento_ventas_detalle.ncantidad_pedido) * -1) / _articulos.nfactor_a_venta
                    else 0.00
                end
            end
        end
        else case
            when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then case
                when _articulos.nfactor_a_venta != 0 then (_movimiento_ventas_detalle.ncantidad_pedido) / _articulos.nfactor_a_venta
                else 0.00
            end
            else case
                when _articulos.nfactor_a_venta != 0 then (_movimiento_ventas_detalle.ncantidad_pedido * -1) / _articulos.nfactor_a_venta
                else 0.00
            end
        end
    end as ncantidad_venta,
    case
        when _articulos.narticulos_factor_conversion != 0 then case
            when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then case
                when _movimiento_ventas.lcastigo = 0 then (
                    _articulos.nfactor_a_venta /(
                        case
                            when _movimiento_ventas_detalle.nfactor_conversion = 0 then _articulos.narticulos_factor_conversion
                            else _movimiento_ventas_detalle.nfactor_conversion
                        end
                    )
                ) * _movimiento_ventas_detalle.ncantidad_pedido
                else _movimiento_ventas_detalle.ncantidad_pedido
            end
            else case
                when _movimiento_ventas.lcastigo = 0 then (
                    (
                        _articulos.nfactor_a_venta /(
                            case
                                when _movimiento_ventas_detalle.nfactor_conversion = 0 then _articulos.narticulos_factor_conversion
                                else _movimiento_ventas_detalle.nfactor_conversion
                            end
                        )
                    ) * _movimiento_ventas_detalle.ncantidad_pedido
                ) * -1
                else (_movimiento_ventas_detalle.ncantidad_pedido) * -1
            end
        end
        else case
            when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then _movimiento_ventas_detalle.ncantidad_pedido
            else _movimiento_ventas_detalle.ncantidad_pedido * -1
        end
    end as ncantidad_consumo,
    RTRIM(clientes_corporativos.cid_corporativo) + '-' + RTRIM(clientes_corporativos.cnomb_clie) AS cliente,
    --RTRIM(clientes_corporativos.cid_clie)+'-'+RTRIM(clientes_corporativos.cnomb_clie))  
    RTRIM(_movimiento_ventas.cid_vend) + '-' + RTRIM(_vendedor.capel_vend) + ' ' + RTRIM(_vendedor.cnomb_vend) AS nombre_vendedor,
    RTRIM(_movimiento_ventas.cid_vendedor_cob) + '-' + RTRIM(_vendedorCob.capel_vend) + ' ' + RTRIM(_vendedorCob.cnomb_vend) AS vendedor_origen,
    RTRIM(_movimiento_ventas.cgrp_dscto_clie) + '-' + RTRIM(_grupclie.cdesc_grupclie) AS cgrupo_descuento,
    case
        when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then case
            when _movimiento_ventas_detalle.ckits = '1' then 00000.0000
            else _movimiento_ventas_detalle.npeso_detalle
        end
        else (
            case
                when _movimiento_ventas_detalle.ckits = '1' then 0000.0000
                else _movimiento_ventas_detalle.npeso_detalle * -1
            end
        )
    end as npeso_detalle,
    rtrim(_movimiento_ventas.ctipo_referencia) + _movimiento_ventas.cserie_referencia + rtrim(_movimiento_ventas.cdcto_referencia) as referencia,
    case
        when _movimiento_ventas_detalle.lgratuito = 1 then 'SI'
        else 'NO'
    end as lgratuito,
    case
        when _movimiento_ventas_detalle.nimporte_descuento > 0 then 'SI'
        else 'NO'
    end as cdescuento,
    case
        when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then _movimiento_ventas_detalle.nimporte_descuento
        else (_movimiento_ventas_detalle.nimporte_descuento * -1)
    end as nimporte_descuento,
    _forma_pago.cdescripcion AS cforma_pago_desc,
    _categoria_1.ccodigo_categoria + ' ' + _categoria_1.cdescripcion_corta_cat AS ccategoria1_desc,
    _categoria_2.ccodigo_categoria + ' ' + _categoria_2.cdescripcion_corta_cat AS ccategoria2_desc,
    _categoria_3.ccodigo_categoria + ' ' + _categoria_3.cdescripcion_corta_cat AS ccategoria3_desc,
    _categoria_4.ccodigo_categoria + ' ' + _categoria_4.cdescripcion_corta_cat AS ccategoria4_desc,
    _categoria_5.ccodigo_categoria + ' ' + _categoria_5.cdescripcion_corta_cat AS ccategoria5_desc,
    case
        when _movimiento_ventas_detalle.ckits = '2' then _movimiento_ventas_detalle.cid_kits_cabecera + '-' + _kits_cabecera.cdescripcion
        else '       '
    end as ckits,
    case
        when _movimiento_ventas_detalle.ctipo_documento_id != 'NC' then _movimiento_ventas_detalle.nimp_recargo_detalle
        else (
            _movimiento_ventas_detalle.nimp_recargo_detalle * -1
        )
    end as nimp_recargo_detalle,
    ISNULL(
        RTRIM(clientes_corporativos.cgiro_id) + '-' + RTRIM(_giro_cliente.cdescripcion),
        space(20)
    ) AS ccanal,
    ISNULL(
        RTRIM(clientes_corporativos.ctipo_negocio) + '-' + RTRIM(_tipo_negocio.cdescripcion),
        space(20)
    ) AS ctipo_negocio,
    ISNULL(
        clientes_corporativos.cdias_semana_id_visita,
        space(20)
    ) as cdias_visita,
    ISNULL(
        RTRIM(clientes_corporativos.ccodigo_ruta_despacho) + '-' + RTRIM(_ruta_despacho_ventas.cdescripcion_ruta_despacho),
        space(20)
    ) as cruta_despacho,
    _movimiento_ventas_detalle.cid_lista,
    _articulos.cproveedor_id + ' ' + isnull(rtrim(_proveedor.cproveedor_nombre), '') as cproveedor,
    _vendedor.cvend_padre + '-' + RTRIM(_vendedor_padre.capel_vend) + ' ' + RTRIM(_vendedor_padre.cnomb_vend) AS cvend_padre,
    rtrim(_movimiento_ventas.cid_transportista) + '-' + RTRIM(
        RTRIM(isnull(_vehiculo.cvehiculo_placa, '')) + ' ' + RTRIM(isnull(_proveedort.cproveedor_nombre, ''))
    ) as ctransportista,
    000000000000000.00 as ngratuito_soles,
    space(1) as lbonificado,
    000000000000000.00 as ngratuito_dolares,
    _movimiento_ventas_detalle.ncantidad_devolucion / _articulos.narticulos_factor_conversion as devuelto,
    _articulos.nfactor_a_reporte,
    clientes_corporativos.cubigeo_clie + '-' + isnull(_ubigeos.cdistrito, '') as cubigeo,
    case
        when _movimiento_ventas.lgenerado_pedido = 1
        or _movimiento_ventas.ctipo_documento_id = 'PE' then 'PRE-VENTA'
        else 'AUTOVENTA'
    end as lpreventa,
    _cliente.cid_categoria as OPBD,
    case
        when _cliente.lrelet = 1 then 'SI'
        else 'NO'
    end as lrelet,
    _articulos.carticulos_ubicacion_principal,
    _cliente.clie_ref1,
    _cliente.clie_ref2,
    _cliente.clie_ref3,
    _cliente.clie_ref4,
    _cliente.clie_ref5,
    _movimiento_ventas.cruc_cliente,
    _movimiento_ventas.cserie_documento,
    _articulos.cunidad_de_medida_compra,
    _articulos.cunidad_de_medida_consumo,
    _articulos.cunidad_de_medida_venta,
    case
        when clientes_corporativos.cid_clie = CR.cid_clie then 'Si'
        else 'No'
    end as Relacionado,
    ISNULL(linea.cdescripcion, space(50)) as linea,
    _movimiento_ventas.cuser_creacion as Usuario_Rex,
    _movimiento_ventas_detalle.nimporte_total *(_movimiento_ventas_detalle.nporc_percepcion / 100) * (1 - _movimiento_ventas_detalle.lgratuito) as npercepcion,
    case
        when _movimiento_ventas_detalle.nporc_percepcion = 0
        or _movimiento_ventas_detalle.lgratuito = 1 then 'NO'
        else 'SI'
    end as conPercep,
    _articulos.carticulos_nro_parte
FROM
    _movimiento_ventas _movimiento_ventas (nolock)
    inner join _vendedor _vendedor (nolock) ON _movimiento_ventas.cid_vend = _vendedor.cid_vend
    inner join _vendedor _vendedor_padre (nolock) on _vendedor.cvend_padre = _vendedor_padre.cid_vend
    left join _vendedor _vendedorCob (nolock) ON _movimiento_ventas.cid_vendedor_cob = _vendedorCob.cid_vend
    left join _grupclie _grupclie (nolock) on _movimiento_ventas.cgrp_dscto_clie = _grupclie.cid_grupclie
    inner join clientes_corporativos clientes_corporativos (nolock) on _movimiento_ventas.cid_clie = clientes_corporativos.cid_clie
    left join _clientes_relacionados CR on CR.cid_clie = clientes_corporativos.cid_clie
    left join _ruta_despacho_ventas _ruta_despacho_ventas (nolock) on clientes_corporativos.ccodigo_ruta_despacho = _ruta_despacho_ventas.ccodigo_ruta_despacho
    left join _ubigeos _ubigeos on clientes_corporativos.cubigeo_clie = _ubigeos.cubigeo_id
    left join _giro_cliente _giro_cliente (nolock) on clientes_corporativos.cgiro_id = _giro_cliente.cgiro_id
    left join _tipo_negocio _tipo_negocio (nolock) on clientes_corporativos.ctipo_negocio = _tipo_negocio.ctipo_negocio
    left join _forma_pago _forma_pago (nolock) on _movimiento_ventas.cforma_pago_id = _forma_pago.cforma_pago_id
    left join _proveedor _proveedort on _movimiento_ventas.cid_transportista = _proveedort.cproveedor_id
    left join _vehiculo _vehiculo on _movimiento_ventas.cvehiculo_id = _vehiculo.cvehiculo_id
    inner join _movimiento_ventas_detalle _movimiento_ventas_detalle (nolock) on _movimiento_ventas.nid_cia = _movimiento_ventas_detalle.nid_cia
    AND _movimiento_ventas.ctipo_documento_id = _movimiento_ventas_detalle.ctipo_documento_id
    AND _movimiento_ventas.cserie_documento = _movimiento_ventas_detalle.cserie_documento
    AND _movimiento_ventas.cnumero_documento = _movimiento_ventas_detalle.cnumero_documento
    AND _movimiento_ventas_detalle.ckits != '1'
    left join _promociones _promociones on _movimiento_ventas_detalle.cpromoid = _promociones.cpromoid
    left join _kits_cabecera _kits_cabecera (nolock) on _movimiento_ventas_detalle.cid_kits_cabecera = _kits_cabecera.cid_kits_cabecera
    left join _promociones _promocionesK on _kits_cabecera.cpromoid = _promocionesK.cpromoid
    inner join _articulos _articulos (nolock) on _movimiento_ventas_detalle.carticulos_id = _articulos.carticulos_id
    AND _articulos.cproveedor_id like '%'
    left join _categoria_1 _categoria_1 (nolock) on _articulos.ccategoria_1 = _categoria_1.ccodigo_categoria
    left join _categoria_2 _categoria_2 (nolock) on _articulos.ccategoria_2 = _categoria_2.ccodigo_categoria
    left join _categoria_3 _categoria_3 (nolock) on _articulos.ccategoria_3 = _categoria_3.ccodigo_categoria
    left join _categoria_4 _categoria_4 (nolock) on _articulos.ccategoria_4 = _categoria_4.ccodigo_categoria
    left join _categoria_5 _categoria_5 (nolock) on _articulos.ccategoria_5 = _categoria_5.ccodigo_categoria
    left join _proveedor _proveedor on _articulos.cproveedor_id = _proveedor.cproveedor_id
    left join _linea_producto linea on _movimiento_ventas.cid_linea = linea.cid_linea
    left join _cliente _cliente on _movimiento_ventas.cid_clie = _cliente.cid_clie
WHERE
    --_movimiento_ventas.nid_cia = '1'  
    --AND _movimiento_ventas.cid_ofi = ' + ologixuser.user_oficina + ' AND , )
    _movimiento_ventas.dfecha_documento >= { d '2022-07-01' }
    AND _movimiento_ventas.dfecha_documento <= { d '2022-07-31' } -- AND _movimiento_ventas.cestado_documento_id != 'X'
    -- AND _movimiento_ventas.ctipo_documento_id IN (' + vp_t1 + ',' + vp_t2+ ',' + vp_t3 + ',' + vp_t4+','+vp_t5+ ','+vp_t6+ ')
    -- AND clientes_corporativos.cid_corporativo like ?vp_cliente  + _Alticulums
order by
    _movimiento_ventas_detalle.ctipo_documento_id + _movimiento_ventas_detalle.cserie_documento + _movimiento_ventas_detalle.cnumero_documento + _movimiento_ventas_detalle.cnumero_documento_item 
FOR JSON PATH , ROOT('cuboVentas') ) as data
    `
}