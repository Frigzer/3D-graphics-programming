using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class blinking : MonoBehaviour
{
    public Light myLight;
    public float minWaitTime = 0f;
    public float maxWaitTime = 0.15f;
    public float minLightIntensity = 4.5f;
    public float maxLightIntensity = 5.5f;

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        StartCoroutine(Blinking());
    }

    IEnumerator Blinking()
    {
        while (true)
        {
            yield return new WaitForSeconds(Random.Range(minWaitTime, maxWaitTime));
            myLight.intensity = Random.Range(minLightIntensity, maxLightIntensity);
        }
    }
}
