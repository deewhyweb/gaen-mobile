/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package covidsafepaths.bt.exposurenotifications.nearby;

import android.content.Context;
import android.util.Log;

import com.google.common.io.BaseEncoding;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import org.threeten.bp.Duration;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import covidsafepaths.bt.exposurenotifications.ExposureNotificationClientWrapper;
import covidsafepaths.bt.exposurenotifications.common.AppExecutors;
import covidsafepaths.bt.exposurenotifications.common.TaskToFutureAdapter;
import covidsafepaths.bt.exposurenotifications.network.KeyFileBatch;

/**
 * A thin class to take responsibility for submitting downloaded Diagnosis Key files to the Google
 * Play Services Exposure Notifications API.
 */
public class DiagnosisKeyFileSubmitter {
    private static final String TAG = "KeyFileSubmitter";
    // Use a very very long timeout, in case of a stress-test that supplies a very large number of
    // diagnosis key files.
    private static final Duration PROVIDE_KEYS_TIMEOUT = Duration.ofMinutes(30);
    private static final BaseEncoding BASE16 = BaseEncoding.base16().lowerCase();
    private static final BaseEncoding BASE64 = BaseEncoding.base64();

    private final ExposureNotificationClientWrapper client;

    public DiagnosisKeyFileSubmitter(Context context) {
        client = ExposureNotificationClientWrapper.get(context);
    }

    /**
     * Accepts batches of key files, and submits them to provideDiagnosisKeys(), and returns a future
     * representing the completion of that task.
     *
     * <p>This naive implementation is not robust to individual failures. In fact, a single failure
     * will fail the entire operation. A more robust implementation would support retries, partial
     * completion, and other robustness measures.
     *
     * <p>Returns early if given an empty list of batches.
     */
    public ListenableFuture<?> submitFiles(List<KeyFileBatch> batches, String token) {
        if (batches.isEmpty()) {
            Log.d(TAG, "No files to provide to google play services.");
            return Futures.immediateFuture(null);
        }
        Log.d(TAG, "Providing  " + batches.size() + " diagnosis key batches to google play services.");

        ListenableFuture<?> allDone = submitBatches(batches, token);

        // Add a listener to delete all the files.
        allDone.addListener(
                () -> {
                    for (KeyFileBatch b : batches) {
                        for (File f : b.files()) {
                            f.delete();
                        }
                    }
                },
                AppExecutors.getBackgroundExecutor());

        return allDone;
    }

    private ListenableFuture<?> submitBatches(List<KeyFileBatch> batches, String token) {
        Log.d(TAG, "Combining ["
                        + batches.size()
                        + "] key file batches into a single submission to provideDiagnosisKeys().");
        List<File> files = new ArrayList<>();
        for (KeyFileBatch b : batches) {
            files.addAll(b.files());
            logBatch(b);
        }

        return TaskToFutureAdapter.getFutureWithTimeout(
                client.provideDiagnosisKeys(files, token),
                PROVIDE_KEYS_TIMEOUT.toMillis(),
                TimeUnit.MILLISECONDS,
                AppExecutors.getScheduledExecutor());
    }

    private void logBatch(KeyFileBatch batch) {
        Log.d(TAG, "Batch [" + batch.batchNum() + "] has [" + batch.files().size() + "] files.");
    }
}
