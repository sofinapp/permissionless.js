import { http } from "viem"
import { foundry } from "viem/chains"
import { describe, expect } from "vitest"
import { testWithRpc } from "../../../permissionless-test/src/testWithRpc"
import {
    type BundlerClient,
    createBundlerClient
} from "../../clients/createBundlerClient"
import type { ENTRYPOINT_ADDRESS_V06_TYPE } from "../../types/entrypoint"
import { ENTRYPOINT_ADDRESS_V06 } from "../../utils"

describe("chainId", () => {
    testWithRpc("chainId", async ({ rpc }) => {
        const { altoRpc } = rpc
        const entryPoint = ENTRYPOINT_ADDRESS_V06

        const bundlerClient: BundlerClient<ENTRYPOINT_ADDRESS_V06_TYPE> =
            createBundlerClient({
                transport: http(altoRpc),
                entryPoint
            })
        const chainId = await bundlerClient.chainId()
        expect(chainId).toBe(foundry.id)
    })
})
