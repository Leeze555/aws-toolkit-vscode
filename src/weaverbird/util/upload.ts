/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import got from 'got'

import { getLogger } from '../../shared/logger/logger'

/**
 * uploadCode
 *
 * uses a presigned url and files checksum to transfer data to s3 through http.
 */
export async function uploadCode(url: string, buffer: Buffer, kmsKeyArn?: string) {
    try {
        await got(url, {
            method: 'PUT',
            body: buffer,
            headers: {
                'Content-Type': 'application/zip',
                ...(kmsKeyArn && {
                    'x-amz-server-side-encryption-aws-kms-key-id:': kmsKeyArn,
                    'x-amz-server-side-encryption': 'aws:kms',
                }),
            },
        })
    } catch (e) {
        getLogger().error(`weaverbird: failed to upload code to s3: ${(e as Error).message}`)
        throw e
    }
}
