import { http, isHash, zeroAddress } from "viem"
import { generatePrivateKey } from "viem/accounts"
import { describe, expect } from "vitest"
import { testWithRpc } from "../../../permissionless-test/src/testWithRpc"
import {
    getPimlicoPaymasterClient,
    getSimpleAccountClient
} from "../../../permissionless-test/src/utils"
import { createBundlerClient } from "../../clients/createBundlerClient"
import { ENTRYPOINT_ADDRESS_V06, ENTRYPOINT_ADDRESS_V07 } from "../../utils"

describe("getUserOperationByHash", () => {
    testWithRpc("getUserOperationByHash_V06", async ({ rpc }) => {
        const { anvilRpc, altoRpc, paymasterRpc } = rpc
        const bundlerClientV06 = createBundlerClient({
            transport: http(altoRpc),
            entryPoint: ENTRYPOINT_ADDRESS_V06
        })

        const simpleAccountClient = await getSimpleAccountClient({
            entryPoint: ENTRYPOINT_ADDRESS_V06,
            privateKey: generatePrivateKey(),
            altoRpc: altoRpc,
            anvilRpc: anvilRpc,
            paymasterClient: getPimlicoPaymasterClient({
                entryPoint: ENTRYPOINT_ADDRESS_V06,
                paymasterRpc
            })
        })

        const userOperation =
            await simpleAccountClient.prepareUserOperationRequest({
                userOperation: {
                    callData: await simpleAccountClient.account.encodeCallData({
                        to: zeroAddress,
                        data: "0x",
                        value: 0n
                    })
                }
            })

        userOperation.signature =
            await simpleAccountClient.account.signUserOperation(userOperation)

        const opHash = await bundlerClientV06.sendUserOperation({
            userOperation
        })

        expect(isHash(opHash)).toBe(true)

        await bundlerClientV06.waitForUserOperationReceipt({
            hash: opHash,
            timeout: 10000
        })

        const userOperationFromUserOpHash =
            await bundlerClientV06.getUserOperationByHash({ hash: opHash })

        expect(userOperationFromUserOpHash).not.toBeNull()
        expect(userOperationFromUserOpHash?.entryPoint).toBe(
            ENTRYPOINT_ADDRESS_V06
        )

        for (const key in userOperationFromUserOpHash?.userOperation) {
            const expected = userOperationFromUserOpHash?.userOperation[key]
            const actual = userOperation[key]

            if (typeof expected === "string" && typeof actual === "string") {
                expect(expected.toLowerCase()).toBe(actual.toLowerCase())
            } else {
                expect(expected).toBe(actual)
            }
        }
    })

    testWithRpc("getUserOperationByHash_V07", async ({ rpc }) => {
        const { anvilRpc, altoRpc, paymasterRpc } = rpc

        const bundlerClientV07 = createBundlerClient({
            transport: http(altoRpc),
            entryPoint: ENTRYPOINT_ADDRESS_V07
        })

        const simpleAccountClient = await getSimpleAccountClient({
            entryPoint: ENTRYPOINT_ADDRESS_V07,
            privateKey: generatePrivateKey(),
            altoRpc: altoRpc,
            anvilRpc: anvilRpc,
            paymasterClient: getPimlicoPaymasterClient({
                entryPoint: ENTRYPOINT_ADDRESS_V07,
                paymasterRpc
            })
        })

        const userOperation =
            await simpleAccountClient.prepareUserOperationRequest({
                userOperation: {
                    callData: await simpleAccountClient.account.encodeCallData({
                        to: zeroAddress,
                        data: "0x",
                        value: 0n
                    })
                }
            })

        userOperation.signature =
            await simpleAccountClient.account.signUserOperation(userOperation)

        const opHash = await bundlerClientV07.sendUserOperation({
            userOperation
        })

        expect(isHash(opHash)).toBe(true)

        await bundlerClientV07.waitForUserOperationReceipt({
            hash: opHash,
            timeout: 10000
        })

        const userOperationFromUserOpHash =
            await bundlerClientV07.getUserOperationByHash({ hash: opHash })

        for (const key in userOperationFromUserOpHash?.userOperation) {
            const expected = userOperationFromUserOpHash?.userOperation[key]
            const actual = userOperation[key]

            if (typeof expected === "string" && typeof actual === "string") {
                expect(expected.toLowerCase()).toBe(actual.toLowerCase())
            } else {
                expect(expected).toBe(actual)
            }
        }
    })
})
