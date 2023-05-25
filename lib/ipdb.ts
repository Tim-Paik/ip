export interface Meta {
  build: number
  ip_version: number
  languages: { [key: string]: number }
  fields: string[]
  node_count: number
  v4node: number
  total_size: number
}

export interface IPData {
  country_name: string
  region_name: string
  city_name: string
  owner_domain: string
  isp_domain: string
  ip: string
  bitmask: number
}

export default class IPDB {
  meta: Meta
  data: Buffer
  patches: any
  constructor(data: Buffer) {
    const metaLen = data.readInt32BE(0)
    this.data = data

    this.meta = JSON.parse(data.slice(4, 4 + metaLen).toString())
    this.data = data.slice(4 + metaLen)

    if (this.meta.v4node === undefined && this.meta.ip_version & 0x01) {
      this._initv4node()
    }
  }

  _initv4node() {
    let node = 0
    for (let i = 0; i < 80; i += 1) {
      node = this._node(node, 0)
    }

    for (let i = 80; i < 96; i += 1) {
      node = this._node(node, 1)
    }

    this.meta.v4node = node
  }

  find(ip: string, language: string) {
    const result: {
      data: IPData
      code: number
      message: string
    } = {
      data: {
        country_name: "",
        region_name: "",
        city_name: "",
        owner_domain: "",
        isp_domain: "",
        ip: "",
        bitmask: 0,
      },
      code: 0,
      message: "",
    }
    try {
      result.data = this._find(ip, language)
      result.code = 0
    } catch (error) {
      result.code = -1
      if (error instanceof Error) result.message = error.message
      else result.message = String(error)
    }

    return result
  }

  _find(ip: string, language: string) {
    const bits = this._toBits(ip)
    let node = bits.length === 32 ? this.meta.v4node : 0
    let cidr = 0

    while (cidr < bits.length) {
      node = this._node(node, bits[cidr])
      cidr += 1
      if (node >= this.meta.node_count) {
        break
      }
    }

    const data = this._resolve(node)

    let offset = 0
    if (this.meta.languages[language]) {
      offset = this.meta.languages[language]
    }

    const result: { [key: string]: any } = {}
    for (let i = 0; i < this.meta.fields.length; i += 1) {
      result[this.meta.fields[i]] = data[offset + i]
    }

    result.ip = ip
    result.bitmask = cidr

    return result as IPData
  }

  _resolve(node: number) {
    const offset = node + (this.meta.node_count << 3) - this.meta.node_count
    const len = this.data.readUInt16BE(offset)
    const buf = this.data.slice(offset + 2, offset + 2 + len)
    return buf.toString().split("\t")
  }

  _node(id: number, idx: number) {
    return this.data.readUInt32BE((id << 3) | (idx << 2))
  }

  _toBits(ip: string) {
    const isIPv4 = function (input: string) {
      return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        input
      )
    }
    const isIPv6 = function (input: string) {
      return /^(([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))$/.test(
        input
      )
    }
    const isIP = function (input: string) {
      if (isIPv4(input)) {
        return 4
      } else if (isIPv6(input)) {
        return 6
      } else {
        return 0
      }
    }
    const version = isIP(ip)
    if (!version) {
      throw new Error("ip format error")
    }

    if (version === 4 && !(this.meta.ip_version & 0x01)) {
      throw new Error("no support ipv4")
    }

    if (version === 6 && !(this.meta.ip_version & 0x02)) {
      throw new Error("no support ipv6")
    }

    return version === 4 ? this._toBits4(ip) : this._toBits6(ip)
  }

  _toBits4(ip: string) {
    const result = []
    const items = ip.split(".")
    for (const item of items) {
      const num = parseInt(item, 10)
      for (let i = 7; i >= 0; i -= 1) {
        result.push((num >> i) & 1)
      }
    }

    return result
  }

  _toBits6(ip: string) {
    const result: number[][] = [[], []]
    const parts = ip.split("::", 2)
    for (let index = 0; index < 2; index += 1) {
      if (parts[index]) {
        const items = parts[index].split(":")
        for (const item of items) {
          const num = parseInt(item, 16)
          for (let i = 15; i >= 0; i -= 1) {
            result[index].push((num >> i) & 1)
          }
        }
      }
    }

    const pad = 128 - result[0].length - result[1].length

    return [...result[0], ...new Array(pad).fill(0), ...result[1]]
  }
}
