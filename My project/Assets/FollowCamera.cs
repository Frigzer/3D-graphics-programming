using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FollowCamera : MonoBehaviour
{

    public Transform lookAtTarget;

    // Update is called once per frame
    void FixedUpdate()
    {
        transform.LookAt(lookAtTarget.position);
    }
}
