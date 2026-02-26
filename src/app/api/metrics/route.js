import metrics from "@/app/lib/metrics";

export async function GET() {
    const data = await metrics.register.metrics();

    return new Response(data, {
        headers: { "Content-Type": metrics.register.contentType }
    });
}
